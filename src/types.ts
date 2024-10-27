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

export interface RepoOwner {
	login: string;
	avatarUrl: string;
	url: string;
}

export interface PinnedRepo {
	name: string;
	nameWithOwner: string;
	description: string | null;
	url: string;
	stargazerCount: number;
	forkCount: number;
	primaryLanguage: {
		name: string;
	} | null;
	owner: RepoOwner;
	createdAt: string;
	updatedAt: string;
}

export interface StandardPinnedRepo {
	name: string;
	full_name: string;
	description: string | null;
	html_url: string;
	stargazers_count: number;
	forks_count: number;
	language: string;
	owner: {
		login: string;
		url: string;
		avatar_url: string;
	};
	created_at: string;
	updated_at: string;
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
