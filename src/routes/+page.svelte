<script module lang="ts">
	import * as Avatar from '$lib/components/ui/avatar';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import GitHubContributions from '$lib/components/github-contributions.svelte';
	import * as Sheet from '$lib/components/ui/sheet';
	import { createQuery } from '@tanstack/svelte-query';
	import { fetchGithubData } from '$lib/api';
	import { Check, CircleX, Pin, GitFork, Star, Calendar, Terminal } from 'lucide-svelte';
	import { GithubLogo, PushPin } from 'phosphor-svelte';
	import { formatFullDate } from '$lib/date-format';
</script>

<script>
	import LoadingSkeleton from '$lib/components/loading-skeleton.svelte';

	let username: string = '';
	let timer: ReturnType<typeof setTimeout>;
	const debounce = (value: string) => {
		clearTimeout(timer);
		timer = setTimeout(() => {
			username = value;
		}, 1000);
	};

	let dialogOpen: boolean = false;
	let dialogContent: any = {};

	const handleDialog = (repo: any) => {
		dialogContent = {};
		dialogOpen = !dialogOpen;
		dialogContent = repo;
	};

	console.log(username);

	$: query = createQuery({
		queryKey: ['data', username],
		queryFn: async () => {
			const { user, repos, contributions, totalContributions, pinnedRepos } =
				await fetchGithubData(username);
			return { user, repos, contributions, totalContributions, pinnedRepos };
		},
		enabled: !!username
	});

	console.log(query);
</script>

<svelte:head>
	<title>Github Cards by Ultimate Mercer</title>
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
		/>
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
				<Terminal class="mr-1" /> Waiting for a username
			{/if}
		</div>

		<section>
			{#if $query.isLoading}
				<LoadingSkeleton />
			{:else if $query.isError}
				<h1 class="text-5xl font-bold text-black/10 dark:text-white/10 text-center">
					Failed to load Github data :(
				</h1>
			{:else if $query.isSuccess}
				<div class="py-4">
					<div class="flex flex-row gap-5">
						<div class="">
							<img
								src={$query.data.user.avatar_url}
								class="h-56 w-56 object-cover rounded-lg"
								alt=""
							/>
						</div>
						<div class="flex-1">
							<h1 class="text-3xl font-bold tracking-wide">{$query.data.user.name}</h1>
							<h3 class="text-xl font-medium tracking-wide">@{$query.data.user.login}</h3>
							<p>
								{$query.data.user.bio}
							</p>
							<p>Followers: {$query.data.user.followers}</p>
							<p>Following: {$query.data.user.following}</p>
						</div>
					</div>
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
							{$query.data.pinnedRepos.length + $query.data.repos.length} repositories
						</div>
						<div class="flex flex-row flex-wrap gap-2.5">
							{#each $query.data.pinnedRepos as pinned}
								<Button on:click={() => handleDialog(pinned)}>
									<PushPin weight="bold" class="mr-2 h-4 w-4" />
									{pinned.full_name}
								</Button>
							{/each}
							{#each $query.data.repos as repo}
								<Button variant="outline" on:click={() => handleDialog(repo)}>
									{repo.full_name}
								</Button>
							{/each}
						</div>
					</div>
				</div>
				<div class=""></div>
			{:else}
				<div class="py-8">
					<h1 class="text-5xl font-bold text-black/10 dark:text-white/10 text-center">
						Github data will show here
					</h1>
				</div>
			{/if}
		</section>
	</div>
	<Sheet.Root bind:open={dialogOpen}>
		<Sheet.Trigger />
		<Sheet.Content>
			<Sheet.Header>
				<Sheet.Title>{dialogContent.full_name}</Sheet.Title>
				<Sheet.Description></Sheet.Description>
			</Sheet.Header>
			{#if dialogContent.language}
				<Badge class="mb-2" variant="outline">
					{dialogContent.language}
				</Badge>
			{/if}
			<p class="text-base font-medium mb-2">
				{dialogContent.description && dialogContent.description}
			</p>
			<div class="flex flex-col gap-1 justify-between text-sm">
				<span class="flex items-center text-base font-medium mb-2">
					<Star class="w-6 h-6 mr-1.5 fill-yellow-500" color="#eab308" />
					{dialogContent.stargazers_count}
				</span>
				<span class="flex items-center text-base font-medium mb-2">
					<GitFork class="w-6 h-6 mr-1.5" />
					{dialogContent.forks_count}
				</span>
				<span class="flex items-center text-base font-medium mb-2">
					<Calendar class="w-6 h-6 mr-1.5" />Created at: {formatFullDate({
						date: dialogContent.created_at
					})}
				</span>

				<div class="flex items-center text-lg mb-5">
					<Avatar.Root>
						<Avatar.Image
							src={dialogContent.owner.avatar_url}
							class="object-cover"
							alt={`@${dialogContent.owner.login}`}
						/>
						<Avatar.Fallback>{dialogContent.owner.login}</Avatar.Fallback>
					</Avatar.Root>
					<span class="font-medium ml-2">{dialogContent.owner.login}</span>
				</div>

				<Button variant="secondary">
					<a
						href={dialogContent.html_url}
						class="flex items-center"
						target="_blank"
						rel="noopener noreferrer"
					>
						<GithubLogo weight="bold" class="mr-2 h-5 w-5" />
						View on Github
					</a>
				</Button>
			</div>
		</Sheet.Content>
	</Sheet.Root>
</main>
