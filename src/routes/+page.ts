import { Octokit } from '@octokit/rest';

const octokit = new Octokit({
	auth: import.meta.env.VITE_GITHUB_TOKEN
});

const queryForPinned = `
    query($username: String!) {
      user(login: $username) {
        pinnedItems(first: 6, types: [REPOSITORY]) {
          totalCount
          edges {
            node {
              ... on Repository {
                name
                description
                url
                stargazerCount
              }
            }
          }
        }
      }
    }
  `;

// const queryForContributions = `
//   query($username: String!) {
//       user(login: $username) {
//         contributionsCollection {
//           totalCommitContributions
//           totalPullRequestContributions
//           totalIssueContributions
//           totalRepositoryContributions
//           commitContributionsByRepository(maxRepositories: 5) {
//             repository {
//               name
//               url
//             }
//             contributions(first: 5) {
//               nodes {
//                 commitCount
//                 occurredAt
//               }
//             }
//           }
//           pullRequestContributionsByRepository(maxRepositories: 5) {
//             repository {
//               name
//               url
//             }
//             contributions(first: 5) {
//               nodes {
//                 pullRequest {
//                   title
//                   url
//                 }
//               }
//             }
//           }
//           issueContributionsByRepository(maxRepositories: 5) {
//             repository {
//               name
//               url
//             }
//             contributions(first: 5) {
//               nodes {
//                 issue {
//                   title
//                   url
//                 }
//               }
//             }
//           }
//         }
//       }
//     }
//   `;

export async function load() {
	const res = await octokit.users.getByUsername({
		username: 'UltimateMercer'
	});

	const repos: { data: any } = await octokit.repos.listForUser({
		username: 'UltimateMercer'
	});

	const pinnedRepos: { data: any } = await octokit.graphql(queryForPinned, {
		username: 'UltimateMercer'
	});

	// const contributions: { data: any } = await octokit.graphql(queryForContributions, {
	// 	username: 'UltimateMercer'
	// });

	if (!res.data || !repos.data) {
		throw new Error('Data not found');
	}

	return {
		user: res.data,
		pinnedRepos: pinnedRepos.data,
		repos: repos.data
		// contributions: contributions.data
	};
}
