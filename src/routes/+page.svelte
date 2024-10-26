<script module lang="ts">
	import * as Avatar from '$lib/components/ui/avatar';
	import * as Accordion from '$lib/components/ui/accordion';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import * as HoverCard from '$lib/components/ui/hover-card';
	import { Input } from '$lib/components/ui/input';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import GitHubContributions from '$lib/components/github-contributions.svelte';
	import type { User } from '../types';
	import PinnedRepos from '$lib/components/pinned-repos.svelte';
	import AllRepos from '$lib/components/all-repos.svelte';

	import { createQuery } from '@tanstack/svelte-query';
	import { fetchGithubData } from '$lib/api';
</script>

<script>
	let username: string = '';
	let timer: ReturnType<typeof setTimeout>;
	const debounce = (value: string) => {
		clearTimeout(timer);
		timer = setTimeout(() => {
			username = value;
		}, 1000);
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

<main class="container mx-auto px-5 sm:px-6 lg:px-8 py-8">
	<div
		class="relative !border rounded-lg shadow-lg transition-all bg-background/20 backdrop-blur-md backdrop-filter hover:shadow pt-6 px-5 pb-6 mb-2"
	>
		<div
			class="absolute -top-4 bg-background inline-flex items-center px-2 py-1.5 rounded font-medium tracking-wide leading-none text-black dark:text-white !border"
		>
			Insert here a github username
		</div>
		<Input
			type="text"
			placeholder="Input"
			on:keyup={(event) => debounce((event.target as HTMLInputElement).value)}
		/>
	</div>
	<pre>{username}</pre>

	<div>
		{#if $query.isLoading}
			<p>Loading...</p>
		{:else if $query.isError}
			<p>Error: {$query.error.message}</p>
		{:else if $query.isSuccess}
			<pre>{JSON.stringify($query.data, null, 2)}</pre>
		{/if}
	</div>

	<!-- {#if data || !data}
		<div
			class="group relative !border rounded-lg shadow-lg transition-all min-h-[120px] flex flex-col gap-4 bg-background/20 backdrop-blur-md backdrop-filter hover:shadow pt-6 px-5 pb-8 mb-2"
		>
			<div
				class="absolute -top-4 bg-background inline-flex items-center px-2 py-1.5 rounded font-medium tracking-wide leading-none text-black dark:text-white !border"
			>
				Github Data
			</div>
			<div class="flex flex-row gap-5">
				<div class="">
					<img src={data.user.avatar_url} class="h-56 w-56 object-cover rounded-lg" alt="" />
				</div>
				<div class="flex-1">
					<h1 class="text-2xl">{data.user.name}</h1>
					<h3 class="text-lg">@{data.user.login}</h3>
					<p>{data.user.bio}</p>
					<p>Followers: {data.user.followers}</p>
					<p>Following: {data.user.following}</p>
				</div>
			</div>

			<GitHubContributions
				contributions={data.contributions}
				totalContributions={data.totalContributions}
			/>
			<div class="grid grid-cols-1 lg:grid-cols-8 gap-8">
				<div class="lg:col-span-3 px-6 w-full relative">
					<div class="lg:sticky lg:top-20">
						<PinnedRepos username={data.user?.login} />
					</div>
				</div>
				<div class="lg:col-span-5 w-full">
					<h2 class="text-2xl font-bold mb-6">All Repositories</h2>
					<AllRepos repos={data.repos} />
				</div>
			</div>
		</div>
	{/if} -->
</main>
