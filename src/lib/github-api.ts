import { Octokit } from '@octokit/rest';
import { RequestError } from '@octokit/request-error';

// Initialize Octokit with the GitHub token
const octokit = new Octokit({ auth: import.meta.env.VITE_GITHUB_TOKEN });

// Define the structure of a single contribution
export interface Contribution {
	date: string;
	count: number;
}

// Define the structure of the GraphQL response
interface GraphQLResponse {
	user: {
		contributionsCollection: {
			contributionCalendar: {
				weeks: {
					contributionDays: {
						date: string;
						contributionCount: number;
					}[];
				}[];
			};
		};
	};
}

/**
 * Fetches the contributions for a given GitHub username over the past year
 * @param username The GitHub username to fetch contributions for
 * @returns A Promise that resolves to an array of Contribution objects
 * @throws {Error} If there's an issue fetching the contributions
 */
export async function fetchUserContributions(username: string): Promise<Contribution[]> {
	const oneYearAgo = new Date();
	oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

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
		const { user } = await octokit.graphql<GraphQLResponse>(query, {
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

		console.log(contributions[0]);
		console.log(contributions[contributions.length - 1]);
		return contributions;
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
