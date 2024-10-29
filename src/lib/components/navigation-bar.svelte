<script lang="ts">
	import ModeToggle from './mode-toggle.svelte';
</script>

<nav
	class="sticky top-0 z-50 w-full border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
>
	<div class="flex h-16 justify-between items-center px-5">
		<div class="flex items-center">
			<a href="/" aria-label="Home">
				<img
					src="ultimate-logo-red.svg"
					class="!max-w-none mx-auto w-[56px] h-[56px] hidden dark:block"
					width="56"
					height="56"
					alt="Ultimate Mercer Logo"
				/>
			</a>
			<a href="/" aria-label="Home">
				<img
					src="ultimate-logo-dark.svg"
					class="!max-w-none mx-auto w-[56px] h-[56px] block dark:hidden"
					width="56"
					height="56"
					alt="Ultimate Mercer Logo"
				/>
			</a>
		</div>
		<div class="ml-auto">
			<ModeToggle />
		</div>
	</div>
</nav>
