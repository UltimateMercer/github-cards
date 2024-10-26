import { Octokit } from '@octokit/rest';
import type { ContributionsObject, PinnedRepo } from '../types';
import { fetchUserContributions, fetchUserPinnedRepos } from './github-api';

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

export async function fetchGithubContributions(username: string) {
	const { contributions, totalContributions }: ContributionsObject =
		await fetchUserContributions(username);

	return { contributions, totalContributions };
}

export async function fetchGithubPinnedRepos(username: string) {
	const pinnedRepos: PinnedRepo[] = await fetchUserPinnedRepos(username);

	return pinnedRepos;
}

export async function fetchGithubData(username: string) {
	const user = await fetchGithubUser(username);
	const repos = await fetchGithubRepos(username);

	if (!user || !repos) {
		throw new Error('Data not found');
	}

	const { contributions, totalContributions } = await fetchGithubContributions(username);
	const pinnedRepos = await fetchGithubPinnedRepos(username);

	return { user, repos, contributions, totalContributions, pinnedRepos };
}
