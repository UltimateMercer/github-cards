import { Octokit } from '@octokit/rest';
import { fetchUserContributions, fetchUserPinnedRepos } from './github-api';
import { standardizePinnedRepos } from './utils';

const octokit = new Octokit({
	auth: import.meta.env.VITE_GITHUB_TOKEN
});

export async function fetchGithubUser(username: string) {
	const { data: user } = await octokit.users.getByUsername({
		username
	});

	return user ?? null;
}

export async function fetchGithubRepos(username: string) {
	const { data: repos } = await octokit.repos.listForUser({
		username,
		per_page: 100,
		sort: 'updated',
		type: 'all'
	});

	return repos ?? [];
}

export async function fetchGithubOrgsByUsername(username: string) {
	const { data: orgs } = await octokit.orgs.listForUser({
		username
	});

	return orgs ?? [];
}

export async function fetchGithubContributions(username: string) {
	return await fetchUserContributions(username);
}

export async function fetchGithubPinnedRepos(username: string) {
	const pinnedRepos = await fetchUserPinnedRepos(username);
	return standardizePinnedRepos(pinnedRepos);
}

function filterOutPinnedRepos(repos: any[], pinnedRepos: any[]) {
	return repos.filter(
		(repo) =>
			!pinnedRepos.some(
				(pinnedRepo) => pinnedRepo.name === repo.name || pinnedRepo.full_name === repo.full_name
			)
	);
}

export async function fetchGithubData(username: string) {
	const [user, repos, orgs, { contributions, totalContributions }, pinnedRepos] = await Promise.all(
		[
			fetchGithubUser(username),
			fetchGithubRepos(username),
			fetchGithubOrgsByUsername(username),
			fetchGithubContributions(username),
			fetchGithubPinnedRepos(username)
		]
	);

	if (!user) {
		throw new Error('User data not found');
	}

	const filteredRepos = filterOutPinnedRepos(repos, pinnedRepos);

	return {
		user,
		orgs,
		contributions,
		totalContributions,
		pinnedRepos,
		repos: filteredRepos
	};
}
