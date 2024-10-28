<script lang="ts">
	import { Skeleton } from '$lib/components/ui/skeleton';
</script>

<div class="flex flex-row gap-5 mb-5">
	<Skeleton class="h-56 w-56 rounded-lg " />
	<div class="flex-1">
		<Skeleton class="h-56 w-full rounded-lg " />
	</div>
</div>
<Skeleton class="h-44 w-full mb-6" />
