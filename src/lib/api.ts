import { Octokit } from '@octokit/rest';
import type { ContributionsObject, PinnedRepo } from '../types';
import { fetchUserContributions, fetchUserPinnedRepos } from './github-api';
import { standardizePinnedRepos } from './utils';

const octokit = new Octokit({
	auth: import.meta.env.VITE_GITHUB_TOKEN
});

export async function fetchGithubUser(username: string) {
	const { data: user } = await octokit.users.getByUsername({
		username
	});

	if (!user) {
		throw new Error('Data not found');
	}

	return user;
}

export async function fetchGithubRepos(username: string) {
	const { data: repos }: { data: any } = await octokit.repos.listForUser({
		username,
		per_page: 100,
		sort: 'updated',
		type: 'all'
	});

	if (!repos) {
		throw new Error('Data not found');
	}

	return repos;
}

export async function fetchGithubOrgsByUsername(username: string) {
	const { data: orgs = [] } = await octokit.orgs.listForUser({
		username
	});

	return orgs;
}

export async function fetchGithubContributions(username: string) {
	const { contributions, totalContributions }: ContributionsObject =
		await fetchUserContributions(username);

	return { contributions, totalContributions };
}

export async function fetchGithubPinnedRepos(username: string) {
	const pinnedRepos: PinnedRepo[] = await fetchUserPinnedRepos(username);
	const standardPinnedRepos = standardizePinnedRepos(pinnedRepos);

	return standardPinnedRepos;
}

export async function fetchGithubData(username: string) {
	const user = await fetchGithubUser(username);
	const repos = await fetchGithubRepos(username);

	if (!user || !repos) {
		throw new Error('Data not found');
	}

	const { contributions, totalContributions } = await fetchGithubContributions(username);
	const pinnedRepos = await fetchGithubPinnedRepos(username);

	const filteredRepos = repos.filter(
		(repo: any) =>
			!pinnedRepos.some(
				(pinnedRepo) => pinnedRepo.name === repo.name || pinnedRepo.full_name === repo.full_name
			)
	);

	const orgs = await fetchGithubOrgsByUsername(username);

	return {
		user,
		orgs,
		contributions,
		totalContributions,
		pinnedRepos,
		repos: filteredRepos
	};
}
