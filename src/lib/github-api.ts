import { Octokit } from '@octokit/rest';
import { RequestError } from '@octokit/request-error';
import type {
	Contribution,
	ContributionsObject,
	ContributionGraphQLResponse,
	PinnedReposGraphQLResponse
} from '../types';

// Initialize Octokit with the GitHub token
const octokit = new Octokit({ auth: import.meta.env.VITE_GITHUB_TOKEN });

/**
 * Fetches the contributions for a given GitHub username over the past year
 * @param username The GitHub username to fetch contributions for
 * @returns A Promise that resolves to an object containing a array of Contribution objects and the total number of contributions
 * @throws {Error} If there's an issue fetching the contributions
 */
export async function fetchUserContributions(username: string): Promise<ContributionsObject> {
	const oneYearAgo = new Date();
	oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
	oneYearAgo.setDate(oneYearAgo.getDate() - 4);

	const fromDate = oneYearAgo.toISOString();

	const toDate = new Date().toISOString();

	const query = `
    query($username: String!, $from: DateTime!, $to: DateTime!) {
      user(login: $username) {
        contributionsCollection(from: $from, to: $to) {
          contributionCalendar {
            weeks {
              contributionDays {
                date
                contributionCount
              }
            }
          }
        }
      }
    }
  `;

	try {
		const { user } = await octokit.graphql<ContributionGraphQLResponse>(query, {
			username,
			from: fromDate,
			to: toDate
		});

		const contributions: Contribution[] = user.contributionsCollection.contributionCalendar.weeks
			.flatMap((week) => week.contributionDays)
			.map((day) => ({
				date: day.date,
				count: day.contributionCount
			}));

		const contributionCount = contributions.reduce(
			(total, contribution) => total + contribution.count,
			0
		);

		return { contributions: contributions, totalContributions: contributionCount };
	} catch (error) {
		if (error instanceof RequestError) {
			throw new Error(`GitHub API error: ${error.message}`);
		} else {
			throw new Error('An unknown error occurred while fetching contributions');
		}
	}
}

/**
 * Validates if a given string is a valid GitHub username
 * @param username The username to validate
 * @returns true if the username is valid, false otherwise
 */
export function isValidGitHubUsername(username: string): boolean {
	// GitHub usernames allow alphanumeric characters and hyphens
	// They must not start or end with a hyphen
	// Length must be between 1 and 39 characters
	const usernameRegex = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;
	return usernameRegex.test(username);
}

export async function fetchUserPinnedRepos(username: string) {
	const query = `
      query($username: String!) {
        user(login: $username) {
          pinnedItems(first: 6, types: REPOSITORY) {
            nodes {
              ... on Repository {
                name
								nameWithOwner
                description
                url
                stargazerCount
                forkCount
								createdAt
                primaryLanguage {
                  name
                }
								owner {
									login
									avatarUrl
									url
								}
              }
            }
          }
        }
      }
    `;

	try {
		const response = await octokit.graphql<PinnedReposGraphQLResponse>(query, { username });
		const pinnedRepos = response.user.pinnedItems.nodes;
		return pinnedRepos;
	} catch (error) {
		if (error instanceof RequestError) {
			console.error(error);

			throw new Error(`GitHub API error: ${error.message}`);
		} else {
			console.error(error);
			throw new Error('An unknown error occurred while fetching pinned repos');
		}
	}
}
