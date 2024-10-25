<script module lang="ts">
	import * as Avatar from '$lib/components/ui/avatar';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import * as HoverCard from '$lib/components/ui/hover-card';
	import { Input } from '$lib/components/ui/input';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import GitHubContributions from '$lib/components/github-contributions.svelte';
	import type { User } from '../types';
	import PinnedRepos from '$lib/components/pinned-repos.svelte';
</script>

<script>
	export let data;
	console.log(data.repos[0]);
</script>

{#if data.user}
	<h1>{data.user.name} (@{data.user.login})</h1>
{/if}
<main class="container mx-auto px-5 sm:px-6 lg:px-8 py-8">
	<Input class="mb-5" placeholder="Input" />

	<div
		class="group relative !border rounded-lg shadow-lg transition-all min-h-[120px] flex flex-col gap-5 bg-background/20 backdrop-blur-md backdrop-filter hover:shadow pt-6 px-5 pb-5 mb-2 hover:hover-card-dark hover:dark:hover-card-light"
	>
		<div
			class="absolute -top-4 bg-background inline-flex items-center px-2 py-1.5 rounded font-medium tracking-wide leading-none text-black dark:text-white !border"
		>
			Github Data
		</div>
		<div class="flex flex-row gap-5">
			<div class="">
				<img src={data.user.avatar_url} class="h-56 w-56 object-cover rounded mb-2.5" alt="" />
				<h3 class="text-lg">@{data.user.login}</h3>
				<p>Followers: {data.user.followers}</p>
				<p>Following: {data.user.following}</p>
			</div>
			<div class="flex-1">
				<h1 class="text-2xl">{data.user.name}</h1>
				<p>{data.user.bio}</p>
				<p>Public repos: {data.user.public_repos}</p>

				<!-- <div class="">
					<pre>{JSON.stringify(data.user, null, 2)}</pre>
				</div> -->
			</div>
		</div>

		<GitHubContributions username={data.user.login} />
	</div>
	<Avatar.Root>
		<Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
		<Avatar.Fallback>CN</Avatar.Fallback>
	</Avatar.Root>

	<Badge variant="outline">Outline</Badge>

	<Button variant="outline">Button</Button>

	<HoverCard.Root>
		<HoverCard.Trigger>Hover</HoverCard.Trigger>
		<HoverCard.Content>SvelteKit - Web development, streamlined</HoverCard.Content>
	</HoverCard.Root>

	<Skeleton class="h-[20px] w-[100px] rounded-full" />
	<PinnedRepos username={data.user.login} />
	{#each data.repos as repo}
		<p>{repo.name}</p>
	{/each}
</main>
