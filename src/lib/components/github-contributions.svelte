<script lang="ts">
	import { onMount } from 'svelte';
	import { fetchUserContributions, type Contribution, isValidGitHubUsername } from '../github-api';

	export let username: string;

	let contributions: Contribution[] = [];
	let isLoading = true;
	let error: string | null = null;

	$: if (username && isValidGitHubUsername(username)) {
		fetchContributions();
	}

	async function fetchContributions() {
		isLoading = true;
		error = null;
		try {
			contributions = await fetchUserContributions(username);
		} catch (e) {
			error = e instanceof Error ? e.message : 'An unknown error occurred';
		} finally {
			isLoading = false;
		}
	}

	function getColor(count: number): string {
		if (count === 0) return 'bg-gray-100 dark:bg-gray-800';
		if (count < 3) return 'bg-green-200 dark:bg-green-800';
		if (count < 6) return 'bg-green-300 dark:bg-green-700';
		if (count < 9) return 'bg-green-400 dark:bg-green-600';
		return 'bg-green-500';
	}

	function formatDate(dateString: string): string {
		const date = new Date(dateString);
		const formatter = new Intl.DateTimeFormat('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
			timeZone: 'UTC'
		});
		return formatter.format(date);
	}

	function getDayOfWeek(dateString: string): number {
		return new Date(dateString).getDay();
	}

	function getMonthLabel(dateString: string): string {
		const date = new Date(dateString);
		return date.toLocaleString('default', { month: 'short' });
	}

	function getWeekColumns(contributions: Contribution[]): (Contribution | null)[][] {
		const weeks: (Contribution | null)[][] = [Array(7).fill(null)];
		let currentWeek: (Contribution | null)[] = Array(7).fill(null);

		contributions.forEach((contribution, index) => {
			const dayOfWeek = getDayOfWeek(contribution.date);

			if (dayOfWeek === 0 && currentWeek.some((day) => day !== null)) {
				weeks.push(currentWeek);
				currentWeek = Array(7).fill(null);
			}

			currentWeek[dayOfWeek] = contribution;

			if (index === contributions.length - 1) {
				weeks.push(currentWeek);
			}
		});

		return weeks;
	}

	function getMonthPositions(
		weekColumns: (Contribution | null)[][]
	): { label: string; index: number }[] {
		const monthPositions: { label: string; index: number }[] = [];
		let currentMonth = '';

		weekColumns.forEach((week, weekIndex) => {
			week.forEach((day, dayIndex) => {
				if (day) {
					const month = getMonthLabel(day.date);
					if (month !== currentMonth) {
						monthPositions.push({ label: month, index: weekIndex });
						currentMonth = month;
					}
				}
			});
		});

		return monthPositions;
	}

	$: weekColumns = getWeekColumns(contributions);
	$: monthPositions = getMonthPositions(weekColumns);
</script>

<div class="max-w-full overflow-x-auto p-4">
	<h2 class="text-2xl font-bold mb-4">GitHub Contributions for {username}</h2>
	{#if isLoading}
		<p>Loading contributions...</p>
	{:else if error}
		<p class="text-red-500">Error: {error}</p>
	{:else}
		<div class="flex">
			<!-- <div class="flex flex-col mr-2 text-xs text-gray-500">
				<div class="h-5 w-8"></div>
				<div class="h-5 w-8"></div>
				{#each ['Mon', '', 'Wed', '', 'Fri', ''] as day}
					<div class="h-4 w-8 mb-1 text-right pr-2">{day}</div>
				{/each}
			</div> -->
			<div class="flex flex-col">
				<!-- <div class="flex mb-1 text-xs text-gray-500 relative h-5">
					{#each monthPositions as { label, index }}
						<div class="absolute" style="left: {index * 16}px">{label}</div>
					{/each}
				</div> -->
				<div class="flex">
					{#each weekColumns as week, weekIndex}
						<div class="flex flex-col mr-1">
							{#each week as contribution}
								{#if contribution}
									<div
										class="w-4 h-4 rounded-[2px] {getColor(contribution.count)} border mb-1"
										title="{contribution.count} contributions on {formatDate(contribution.date)}"
									>
										<span class="sr-only"
											>{contribution.count} contributions on {formatDate(contribution.date)}</span
										>
									</div>
								{:else}
									<div class="w-4 h-4 mb-1"></div>
								{/if}
							{/each}
						</div>
					{/each}
				</div>
			</div>
		</div>
		<div class="flex justify-end items-center mt-2 text-sm text-gray-600">
			<span class="mr-2">Less</span>
			<div class="flex gap-1">
				<div class="w-4 h-4 bg-gray-100"></div>
				<div class="w-4 h-4 bg-green-200"></div>
				<div class="w-4 h-4 bg-green-300"></div>
				<div class="w-4 h-4 bg-green-400"></div>
				<div class="w-4 h-4 bg-green-500"></div>
			</div>
			<span class="ml-2">More</span>
		</div>
	{/if}
</div>
