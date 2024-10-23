<script lang="ts">
	import NavigationBar from '$lib/components/navigation-bar.svelte';
	import '../app.css';
	let { children } = $props();
	import { ModeWatcher } from 'mode-watcher';
</script>

<ModeWatcher />
<!-- <slot /> -->
<NavigationBar />
{@render children()}
