import { Octokit } from '@octokit/rest';

const octokit = new Octokit({
	auth: import.meta.env.VITE_GITHUB_TOKEN
});

export async function load() {
	const res = await octokit.users.getByUsername({
		username: 'UltimateMercer'
	});

	const repos: { data: any } = await octokit.repos.listForUser({
		username: 'UltimateMercer'
	});

	if (!res.data || !repos.data) {
		throw new Error('Data not found');
	}

	return {
		user: res.data,
		repos: repos.data
	};
}
