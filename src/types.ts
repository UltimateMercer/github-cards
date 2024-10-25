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

export interface Contribution {
	count: number;
	date: string;
}
