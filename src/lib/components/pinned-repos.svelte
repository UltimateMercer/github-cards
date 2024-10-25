<script lang="ts">
	import { onMount } from 'svelte';
	import type { Octokit } from '@octokit/core';
	import type { PinnedReposGraphQLResponse, PinnedRepo, PinnedReposProps } from '../../types';
	import { fetchUserPinnedRepos, isValidGitHubUsername } from '$lib/github-api';
	import { BookMarked, GitFork, Star } from 'lucide-svelte';
	import Badge from './ui/badge/badge.svelte';
	import * as Avatar from '$lib/components/ui/avatar';
	import Button from './ui/button/button.svelte';

	// export let username: PinnedReposProps['username'] = 'UltimateMercer';
	export let username: string;

	// export let octokit: PinnedReposProps['octokit'];

	let pinnedRepos: PinnedRepo[] = [];
	let isLoading = true;
	let error: string | null = null;

	$: if (username && isValidGitHubUsername(username)) {
		fetchPinnedRepos();
	}

	async function fetchPinnedRepos() {
		isLoading = true;
		error = null;

		try {
			pinnedRepos = await fetchUserPinnedRepos(username);
			console.log(pinnedRepos[0]);
		} catch (e) {
			error = e instanceof Error ? e.message : 'An unknown error occurred';
		} finally {
			isLoading = false;
		}
	}

	onMount(fetchPinnedRepos);
</script>

<div class="">
	<h2 class="text-2xl font-bold mb-6">Pinned Repositories</h2>

	{#if isLoading}
		<p class="text-center text-gray-600">Loading pinned repositories...</p>
	{:else if error}
		<p class="text-center text-red-500">Error: {error}</p>
	{:else if pinnedRepos.length === 0}
		<p class="text-center text-gray-600">No pinned repositories found.</p>
	{:else}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
			{#each pinnedRepos as repo}
				<div
					class="relative rounded-lg p-6 hover:shadow-lg transition-shadow duration-300 !border bg-background/20 backdrop-blur-md backdrop-filter"
				>
					<div
						class="absolute -top-4 bg-background inline-flex items-center px-2 py-1.5 rounded font-medium tracking-wide leading-none text-black dark:text-white !border"
					>
						{repo.primaryLanguage ? repo.primaryLanguage.name : 'N/A'}
					</div>

					<h3 class="text-xl font-semibold mb-2">
						<span class="flex"><BookMarked class="mr-1" />{repo.name}</span>
					</h3>
					<p class="text-gray-600 mb-4">{repo.description || 'No description provided.'}</p>
					<div class="flex items-center justify-between text-sm">
						<span class="flex items-center">
							<Star class="w-5 h-5 mr-1" />
							{repo.stargazerCount}
						</span>
						<span class="flex items-center">
							<GitFork class="w-5 h-5 mr-1" />
							{repo.forkCount}
						</span>
					</div>
					<div class="flex justify-between items-center mt-4">
						<Button variant="link">
							<a href={repo.url} target="_blank" rel="noopener noreferrer"> View Repository </a>
						</Button>
					</div>
					<div
						class="absolute -bottom-4 right-4 bg-background inline-flex items-center px-2 py-1.5 rounded font-medium tracking-wide leading-none text-black dark:text-white !border"
					>
						<Avatar.Root class="h-6 w-6">
							<Avatar.Image
								src={repo.owner.avatarUrl}
								class="object-cover"
								alt={`@${repo.owner.login}`}
							/>
							<Avatar.Fallback>{repo.owner.login}</Avatar.Fallback>
						</Avatar.Root>
						<span class="ml-2">{repo.owner.login}</span>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
