export interface User {
	name: string;
	login: string;
	avatar_url: string;
	bio: string | null;
	public_repos: number;
	followers: number;
	following: number;
	html_url: string;
}

export interface DateProps {
	date: string;
	locale?: 'pt-br' | 'en-us';
}

export interface ContributionGraphQLResponse {
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

export interface Contribution {
	count: number;
	date: string;
}

export interface ContributionsObject {
	contributions: Contribution[];
	totalContributions: number;
}

export interface GraphQLError {
	message: string;
	locations: { line: number; column: number }[];
	path: string[];
}

export interface GraphQLErrorResponse {
	errors: GraphQLError[];
}

import type { Octokit } from '@octokit/core';

// export interface PinnedRepo {
// 	name: string;
// 	description: string | null;
// 	url: string;
// 	stargazerCount: number;
// 	forkCount: number;
// 	primaryLanguage: {
// 		name: string;
// 	} | null;
// }

export interface RepoOwner {
	login: string;
	avatarUrl: string;
	url: string;
}

export interface PinnedRepo {
	name: string;
	description: string | null;
	url: string;
	stargazerCount: number;
	forkCount: number;
	primaryLanguage: {
		name: string;
	} | null;
	owner: RepoOwner;
	createdAt: string;
}

export interface PinnedReposProps {
	username: string;
	octokit: Octokit;
}

export interface PinnedReposGraphQLResponse {
	user: {
		pinnedItems: {
			nodes: PinnedRepo[];
		};
	};
}
