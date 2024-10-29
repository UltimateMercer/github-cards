<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar';
	import * as Sheet from '$lib/components/ui/sheet';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { GitFork, Link, Star, Calendar, CalendarArrowUp, Tags } from 'lucide-svelte';
	import { GithubLogo } from 'phosphor-svelte';
	import { formatFullDate } from '$lib/date-format';
	import SheetContent from './ui/sheet/sheet-content.svelte';

	export let dialogOpen: boolean = false;
	export let dialogContent: any = {};
</script>

<Sheet.Root bind:open={dialogOpen}>
	<Sheet.Trigger aria-label="Open sheet" />
	<SheetContent>
		<Sheet.Header>
			<Sheet.Title class="tracking-wide">{dialogContent.full_name}</Sheet.Title>
			<Sheet.Description></Sheet.Description>
		</Sheet.Header>
		{#if dialogContent.language}
			<Badge class="mb-2">
				{dialogContent.language}
			</Badge>
		{/if}
		<p class="text-base font-medium mb-2">
			{dialogContent.description && dialogContent.description}
		</p>
		{#if dialogContent.homepage}
			<a
				href={dialogContent.homepage}
				class="text-base font-medium mb-2 hover:underline flex items-center"
				target="_blank"
				rel="noopener noreferrer"
				aria-label={`Access ${dialogContent.homepage}`}
			>
				<Link class="w-5 h-5 mr-1.5" />
				{dialogContent.homepage}
			</a>
		{/if}
		<div class="flex flex-col gap-1 justify-between text-sm">
			<span class="flex items-center gap-4 mb-2">
				<span class="flex items-center text-base font-medium">
					<Star class="w-6 h-6 mr-1.5 fill-yellow-500" color="#eab308" />
					{dialogContent.stargazers_count}
				</span>
				<span class="flex items-center text-base font-medium">
					<GitFork class="w-5 h-5 mr-1.5" />
					{dialogContent.forks_count}
				</span>
			</span>

			<span class="flex items-center text-base font-medium mb-2">
				<Calendar class="w-5 h-5 mr-1.5" />Created at: {formatFullDate({
					date: dialogContent.created_at
				})}
			</span>
			<span class="flex items-center text-base font-medium mb-2">
				<CalendarArrowUp class="w-5 h-5 mr-1.5" />Updated at: {formatFullDate({
					date: dialogContent.updated_at
				})}
			</span>

			{#if dialogContent.topics.length > 0}
				<span class="flex flex-wrap items-center gap-1 mb-4">
					<Tags class="w-6 h-6 mr-1" />
					{#each dialogContent.topics as topic}
						<Badge variant="outline">{topic}</Badge>
					{/each}
				</span>
			{/if}

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

			<Button variant="secondary" aria-label="View on Github">
				<a
					href={dialogContent.html_url}
					class="flex items-center"
					target="_blank"
					rel="noopener noreferrer"
					aria-label="View on Github"
				>
					<GithubLogo weight="bold" class="mr-2 h-5 w-5" />
					View on Github
				</a>
			</Button>
		</div>
	</SheetContent>
</Sheet.Root>
