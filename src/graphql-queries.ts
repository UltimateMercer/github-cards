export const queryForUserContributions = `
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

export const queryForUserPinnedRepos = `
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
                homepageUrl
								createdAt
                updatedAt
                repositoryTopics(first: 20) {
                  nodes {
                    topic {
                      name
                    }
                  }
                }
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
