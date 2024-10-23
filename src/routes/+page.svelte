<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import * as HoverCard from '$lib/components/ui/hover-card';
	import { Input } from '$lib/components/ui/input';
	import { Skeleton } from '$lib/components/ui/skeleton';
</script>

<main class="container mx-auto px-5 sm:px-6 lg:px-8 py-8">
	<div
		class="group relative !border rounded-lg shadow-lg transition-all min-h-[120px] flex flex-row gap-5 md:flex-row bg-background/20 backdrop-blur-md backdrop-filter hover:shadow pt-6 px-5 pb-5 mb-2 hover:hover-card-dark hover:dark:hover-card-light"
	>
		<div
			class="absolute -top-4 bg-background inline-flex items-center px-2 py-1.5 rounded font-medium tracking-wide leading-none text-black dark:text-white !border"
		>
			Github Data
		</div>
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

	<Input />

	<Skeleton class="h-[20px] w-[100px] rounded-full" />
</main>
