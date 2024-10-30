<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import GitHubContributions from '$lib/components/github-contributions.svelte';
	import { createQuery } from '@tanstack/svelte-query';
	import { fetchGithubData } from '$lib/api';
	import { Check, CircleX } from 'lucide-svelte';
	import { PushPin } from 'phosphor-svelte';
	import LoadingSkeleton from '$lib/components/loading-skeleton.svelte';
	import DialogContent from '$lib/components/dialog-content.svelte';
	import UserData from '$lib/components/user-data.svelte';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { isValidGitHubUsername } from '$lib/github-api';
	import { onMount } from 'svelte';

	let username: string = '';
	let input: string = '';
	let timer: ReturnType<typeof setTimeout>;

	const handleQueryString = (value: string) => {
		const url = new URL(window.location.href);
		url.searchParams.set('un', value);
		history.replaceState(null, '', url);
	};

	const debounce = (value: string) => {
		clearTimeout(timer);
		handleQueryString(value);

		if (isValidGitHubUsername(value)) {
			timer = setTimeout(() => {
				username = value.toLowerCase().replace(/\s+/g, '');
			}, 1000);
		}
	};

	let dialogOpen: boolean = false;
	let dialogContent: any = {};

	const handleDialog = (repo: any) => {
		dialogContent = {};
		dialogOpen = !dialogOpen;
		dialogContent = repo;
	};

	$: query = createQuery({
		queryKey: ['data', username],
		queryFn: async () => {
			const { user, orgs, repos, contributions, totalContributions, pinnedRepos } =
				await fetchGithubData(username);
			return { user, orgs, repos, contributions, totalContributions, pinnedRepos };
		},
		enabled: !!username,
		refetchInterval: 60 * 60 * 1000
	});

	onMount(() => {
		const url = new URL(window.location.href);
		const queryStringUsername = url.searchParams.get('un');

		if (queryStringUsername && isValidGitHubUsername(queryStringUsername)) {
			username = input = queryStringUsername;
		}
	});
</script>

<svelte:head>
	<title>Github Data by Ultimate Mercer</title>
	<meta name="author" content="Ultimate Mercer" />
	<meta name="keywords" content="github, github profile, github data, github username" />
	<meta name="robots" content="index, follow" />

	<!-- Primary Meta Tags -->
	<meta name="title" content="Github Data by Ultimate Mercer" />
	<meta
		name="description"
		content="Search for a Github username to see user information, repositories, and contributions"
	/>

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://githubdata.ultimatemercer.com/" />
	<meta property="og:title" content="Github Data by Ultimate Mercer" />
	<meta
		property="og:description"
		content="Search for a Github username to see user information, repositories, and contributions"
	/>
	<meta
		property="og:image"
		content="https://githubdata.ultimatemercer.com/ultimate-mercer-base.jpg"
	/>

	<!-- Twitter -->
	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:url" content="https://githubdata.ultimatemercer.com/" />
	<meta property="twitter:title" content="Github Data by Ultimate Mercer" />
	<meta
		property="twitter:description"
		content="Search for a Github username to see user information, repositories, and contributions"
	/>
	<meta
		property="twitter:image"
		content="https://githubdata.ultimatemercer.com/ultimate-mercer-base.jpg"
	/>

	<!-- Meta Tags Generated with https://metatags.io -->
</svelte:head>

<main class="container mx-auto flex flex-col gap-6 px-5 sm:px-6 lg:px-8 py-8">
	<div
		class="relative !border rounded-lg shadow-lg transition-all bg-background/20 backdrop-blur-md backdrop-filter hover:shadow pt-6 px-5 pb-6 mb-2"
	>
		<div
			class="absolute -top-4 bg-background inline-flex items-center px-2 py-1.5 rounded font-medium tracking-wide leading-none text-black dark:text-white !border"
		>
			Insert here a Github username
		</div>
		<Input
			type="text"
			placeholder="e.g. UltimateMercer"
			on:keyup={(event) => debounce((event.target as HTMLInputElement).value)}
			value={input}
		/>
		<p class="text-muted-foreground text-sm mt-1">
			The username must be between 1 and 39 characters. Can only contain letters, numbers, and
			hyphens. Cannot start or end with a hyphen.
		</p>
	</div>

	<div
		class="group relative !border rounded-lg shadow-lg transition-all min-h-[120px] flex flex-col gap-4 bg-background/20 backdrop-blur-md backdrop-filter hover:shadow pt-6 px-5 pb-8 mb-2"
	>
		<div
			class="absolute -top-4 bg-background inline-flex items-center px-2 py-1.5 rounded font-medium tracking-wide leading-none text-black dark:text-white !border"
		>
			{#if $query.isLoading}
				<svg
					class="animate-spin mr-1.5 h-5 w-5 text-black dark:text-white"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
				>
					<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
					></circle>
					<path
						class="opacity-75"
						fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
					></path>
				</svg>
				Gathering Github Data...
			{:else if $query.isError}
				<CircleX class="mr-2 h-5 w-5" /> Failed to load Github data
			{:else if $query.isSuccess}
				<Check class="mr-1.5 h-5 w-5" /> Github data loaded successfully
			{:else}
				Waiting for a username...
			{/if}
		</div>
		<section>
			{#if $query.isLoading}
				<LoadingSkeleton />
			{:else if $query.isError}
				<h3 class="text-5xl font-bold text-black/10 dark:text-white/10 text-center">
					Failed to load Github data :(
				</h3>
			{:else if $query.isSuccess}
				<div class="py-4">
					<UserData user={$query.data.user} orgs={$query.data.orgs} />
					<GitHubContributions
						contributions={$query.data.contributions}
						totalContributions={$query.data.totalContributions}
					/>
					<div
						class="relative rounded-lg p-6 my-4 transition-shadow duration-300 !border bg-background/20 backdrop-blur-md backdrop-filter"
					>
						<div
							class="absolute -top-4 bg-background inline-flex items-center px-2 py-1.5 rounded font-medium tracking-wide leading-none text-black dark:text-white !border"
						>
							<Tooltip.Root>
								<Tooltip.Trigger>
									{$query.data.pinnedRepos.length + $query.data.repos.length} repositories*
								</Tooltip.Trigger>
								<Tooltip.Content>
									<p>Can list approximately 100 repositories</p>
								</Tooltip.Content>
							</Tooltip.Root>
						</div>
						<div class="flex flex-row flex-wrap gap-2.5">
							{#each $query.data.pinnedRepos as pinned}
								<Button
									on:click={() => handleDialog(pinned)}
									class="tracking-wide"
									aria-label="Open sheet"
								>
									<PushPin weight="bold" class="mr-2 h-4 w-4" />
									{pinned.full_name}
								</Button>
							{/each}
							{#each $query.data.repos as repo}
								<Button
									variant="outline"
									on:click={() => handleDialog(repo)}
									class="tracking-wide"
									aria-label="Open sheet"
								>
									{repo.full_name}
								</Button>
							{/each}
						</div>
					</div>
				</div>
			{:else}
				<div class="py-8">
					<h3 class="text-5xl font-bold text-black/10 dark:text-white/10 text-center">
						Github data will show here
					</h3>
				</div>
			{/if}
		</section>
	</div>
	<DialogContent bind:dialogOpen bind:dialogContent />
</main>
