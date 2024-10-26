import { fetchUserContributions, fetchUserPinnedRepos } from '$lib/github-api';
import { Octokit } from '@octokit/rest';
import type { ContributionsObject, PinnedRepo } from '../types';

const octokit = new Octokit({
	auth: import.meta.env.VITE_GITHUB_TOKEN
});

export async function load() {
	try {
		const { data: user } = await octokit.users.getByUsername({
			username: 'UltimateMercer'
		});

		const { data: repos }: { data: any } = await octokit.repos.listForUser({
			username: 'UltimateMercer',
			per_page: 100,
			sort: 'updated',
			type: 'all'
		});

		if (!user || !repos) {
			throw new Error('Data not found');
		}

		const pinnedRepos: PinnedRepo[] = await fetchUserPinnedRepos('UltimateMercer');

		const { contributions, totalContributions }: ContributionsObject =
			await fetchUserContributions('UltimateMercer');

		return {
			user,
			repos,
			pinnedRepos,
			contributions,
			totalContributions
		};
	} catch (e) {
		const error = e instanceof Error ? e.message : 'An unknown error occurred';
		console.error(error);
	}
}
