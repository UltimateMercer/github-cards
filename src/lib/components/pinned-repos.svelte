<script lang="ts">
	import { onMount } from 'svelte';
	import type { PinnedRepo, StandardPinnedRepo } from '../../types';
	import { fetchUserPinnedRepos, isValidGitHubUsername } from '$lib/github-api';
	import { BookMarked, GitFork, Star, Calendar } from 'lucide-svelte';
	import Badge from './ui/badge/badge.svelte';
	import * as Avatar from '$lib/components/ui/avatar';
	import Button from './ui/button/button.svelte';
	import * as Carousel from '$lib/components/ui/carousel/index.js';
	import { formatFullDate } from '$lib/date-format';

	export let username: string;

	export let pinnedRepos: StandardPinnedRepo[] = [];
	let isLoading = true;
	let error: string | null = null;

	$: if (username && isValidGitHubUsername(username)) {
		fetchPinnedRepos();
	}

	async function fetchPinnedRepos() {
		isLoading = true;
		error = null;

		try {
			isLoading = false;
		} catch (e) {
			error = e instanceof Error ? e.message : 'An unknown error occurred';
		}
	}

	onMount(fetchPinnedRepos);
</script>

<h2 class="text-2xl font-bold mb-2">Pinned Repositories</h2>

{#if isLoading}
	<p class="text-center text-gray-600">Loading pinned repositories...</p>
{:else if error}
	<p class="text-center text-red-500">Error: {error}</p>
{:else if pinnedRepos.length === 0}
	<p class="text-center text-gray-600">No pinned repositories found.</p>
{:else}
	<Carousel.Root>
		<Carousel.Content>
			{#each pinnedRepos as repo}
				<Carousel.Item>
					<div
						class="group my-4 lg:aspect-square relative rounded-lg p-6 !border bg-background/20 backdrop-blur-md backdrop-filter"
					>
						<div
							class="absolute -top-4 bg-background inline-flex items-center px-2 py-1.5 rounded font-medium tracking-wide leading-none text-black dark:text-white !border"
						>
							{repo.language || 'N/A'}
						</div>

						<h3 class="text-xl font-semibold break-all mb-2">
							{#if username === repo.owner.login}
								{repo.name}
							{:else}
								{repo.full_name}
							{/if}
						</h3>
						<p class="text-gray-600 mb-4">{repo.description || 'No description provided.'}</p>
						<div class="flex flex-col justify-between text-sm">
							<span class="flex items-center text-base font-medium mb-2">
								<Star class="w-6 h-6 mr-1.5 fill-yellow-500" color="#eab308" />
								{repo.stargazers_count}
							</span>
							<span class="flex items-center text-base font-medium mb-2">
								<GitFork class="w-6 h-6 mr-1.5" />
								{repo.forks_count}
							</span>
							<span class="flex items-center text-base font-medium mb-2">
								<Calendar class="w-6 h-6 mr-1.5" />{formatFullDate({ date: repo.created_at })}
							</span>
						</div>
						<div class="flex justify-between items-center mt-4">
							<Button variant="link">
								<a href={repo.html_url} target="_blank" rel="noopener noreferrer">
									View Repository
								</a>
							</Button>
						</div>
						<div
							class="absolute -bottom-4 right-4 bg-background inline-flex items-center px-2 py-1.5 rounded font-medium tracking-wide leading-none text-black dark:text-white !border transition-shadow duration-300"
						>
							<Avatar.Root class="h-6 w-6">
								<Avatar.Image
									src={repo.owner.avatar_url}
									class="object-cover"
									alt={`@${repo.owner.login}`}
								/>
								<Avatar.Fallback>{repo.owner.login}</Avatar.Fallback>
							</Avatar.Root>
							<span class="font-medium ml-2">{repo.owner.login}</span>
						</div>
					</div>
				</Carousel.Item>
			{/each}
		</Carousel.Content>
		<Carousel.Previous />
		<Carousel.Next />
	</Carousel.Root>
{/if}
