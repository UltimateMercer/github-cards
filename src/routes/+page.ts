import { Octokit } from '@octokit/rest';

const octokit = new Octokit();

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

export async function load() {
	const res = await octokit.users.getByUsername({
		username: 'UltimateMercer'
	});

	// const pinnedRepos: { data: any } = await octokit.graphql(queryForPinned, {
	// 	username: 'UltimateMercer'
	// });

	const repos = await octokit.repos.listForUser({
		username: 'UltimateMercer'
	});

	if (!res.data || !repos.data) {
		throw new Error('Data not found');
	}

	return { user: res.data, pinnedRepos: [], repos: repos.data };
}
