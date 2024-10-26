<script lang="ts">
	import { onMount } from 'svelte';
	import { fetchUserContributions, isValidGitHubUsername } from '../github-api';
	import type { Contribution, ContributionsObject } from '../../types';

	export let username: string;

	let response: ContributionsObject | null = null;
	let contributions: Contribution[] = [];
	let totalContributions: number = 0;
	let isLoading = true;
	let error: string | null = null;

	$: if (username && isValidGitHubUsername(username)) {
		fetchContributions();
	}

	async function fetchContributions() {
		isLoading = true;
		error = null;
		try {
			response = await fetchUserContributions(username);
			contributions = response.contributions;
			totalContributions = response.totalContributions;
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

	/**
	 * Groups an array of contributions into weeks.
	 *
	 * @param contributions the array of contributions
	 * @returns an array of arrays, where each inner array represents a week of contributions.
	 * The weeks are ordered from earliest to latest, and the contributions within each week
	 * are ordered from earliest to latest as well.
	 */
	function getWeekColumns(contributions: Contribution[]): (Contribution | null)[][] {
		return contributions.reduce((weeks: (Contribution | null)[][], contribution, index) => {
			// Calculate the week index by dividing the contribution index by 7
			// (since there are 7 days in a week).
			const weekIndex = Math.floor(index / 7);
			// If the week array doesn't exist yet, create it.
			if (!weeks[weekIndex]) {
				weeks[weekIndex] = [];
			}
			// Add the contribution to the week array.
			weeks[weekIndex].push(contribution);
			return weeks;
		}, []);
	}

	$: weekColumns = getWeekColumns(contributions);
</script>

<div class="max-w-full py-4">
	<h2 class="text-2xl font-bold mb-5">GitHub Contributions</h2>
	{#if isLoading}
		<p>Loading contributions...</p>
	{:else if error}
		<p class="text-red-500">Error: {error}</p>
	{:else}
		<div class="relative p-6 bg-background/20 backdrop-blur-md backdrop-filter border rounded-lg">
			<div
				class="absolute -top-4 bg-background inline-flex items-center px-2 py-1.5 rounded font-medium tracking-wide leading-none text-black dark:text-white !border"
			>
				{totalContributions} contributions in the last year
			</div>
			<div class="flex flex-col sm:flex-row">
				<div class="flex flex-col w-full sm:w-auto overflow-x-auto">
					<div class="flex">
						{#each weekColumns as week}
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
			<div class="absolute -bottom-4 right-4 !border bg-background px-2 py-1.5 rounded">
				<div class="flex justify-end items-center text-sm text-gray-600">
					<span class="mr-2">Less</span>
					<div class="flex gap-1">
						<div class="w-4 h-4 bg-gray-100 bg-"></div>
						<div class="w-4 h-4 bg-green-200"></div>
						<div class="w-4 h-4 bg-green-300"></div>
						<div class="w-4 h-4 bg-green-400"></div>
						<div class="w-4 h-4 bg-green-500"></div>
					</div>
					<span class="ml-2">More</span>
				</div>
			</div>
		</div>
	{/if}
</div>
