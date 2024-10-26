<script lang="ts">
	import * as Accordion from '$lib/components/ui/accordion';

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
					<Accordion.Trigger>{repo.full_name}</Accordion.Trigger>
					<Accordion.Content>
						{JSON.stringify(repo, null, 2)}
					</Accordion.Content>
				</Accordion.Item>
			{/each}
		</Accordion.Root>
	{/if}
</div>
