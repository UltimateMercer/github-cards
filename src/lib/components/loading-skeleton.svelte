<script lang="ts">
	import { Skeleton } from '$lib/components/ui/skeleton';
</script>

<div class="flex flex-row gap-5 mb-5">
	<Skeleton class="h-56 w-56 rounded-lg " />
	<div class="flex-1">
		<Skeleton class="h-12 w-72 mb-2" />
		<Skeleton class="h-10 w-56 mb-2" />
		<Skeleton class="h-20 w-96 mb-2" />
		<Skeleton class="h-5 w-32 mb-2" />
		<Skeleton class="h-5 w-32 mb-2" />
	</div>
</div>
<Skeleton class="h-44 w-full mb-6" />
<div class="grid grid-cols-1 lg:grid-cols-8 gap-8">
	<div class="lg:col-span-3 w-full relative">
		<div class="lg:sticky lg:top-20">
			<Skeleton class="aspect-square w-full mb-5" />
		</div>
	</div>
	<div class="lg:col-span-5 w-full">
		<Skeleton class="h-72 w-full mb-5" />
	</div>
</div>
<Skeleton class="h-32 w-full mb-5" />
<div class="grid grid-cols-1 lg:grid-cols-8 gap-8">
	<div class="lg:col-span-3 px-6 w-full relative">
		<div class="lg:sticky lg:top-20">
			<Skeleton class="h-40 w-full mb-5" />
		</div>
	</div>
	<div class="lg:col-span-5 w-full">
		<Skeleton class="h-56 w-full mb-5" />
	</div>
</div>
