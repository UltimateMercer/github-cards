<script lang="ts">
	import * as Accordion from '$lib/components/ui/accordion';
	import * as Avatar from '$lib/components/ui/avatar';

	import { Badge } from '$lib/components/ui/badge';
	import { BookMarked, GitFork, Star, Calendar } from 'lucide-svelte';
	import { formatFullDate } from '$lib/date-format';

	export let repos;
</script>

<div
	class="relative rounded-lg p-6 transition-shadow duration-300 !border bg-background/20 backdrop-blur-md backdrop-filter"
>
	<div
		class="absolute -top-4 bg-background inline-flex items-center px-2 py-1.5 rounded font-medium tracking-wide leading-none text-black dark:text-white !border"
	>
		{repos.length} repositories
	</div>
	{#if repos.length === 0}
		<h3 class="text-2xl font-bold">No repositories found.</h3>
	{:else}
		<Accordion.Root>
			{#each repos as repo}
				<Accordion.Item value={repo.full_name}>
					<Accordion.Trigger>
						<div class="">
							{repo.full_name}
							{#if repo.language}
								<Badge class="ml-2" variant="outline">{repo.language}</Badge>
							{/if}
						</div>
					</Accordion.Trigger>
					<Accordion.Content>
						<div class="">
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
									<Calendar class="w-6 h-6 mr-1.5" />Created at: {formatFullDate({
										date: repo.created_at
									})}
								</span>

								<div class="flex items-center text-lg">
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
						</div>
						<!-- <pre>						
              {JSON.stringify(repo, null, 2)}
            </pre> -->
					</Accordion.Content>
				</Accordion.Item>
			{/each}
		</Accordion.Root>
	{/if}
</div>
