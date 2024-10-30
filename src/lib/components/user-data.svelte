<script lang="ts">
	import { Building2, Dot, Link, MapPin } from 'lucide-svelte';
	import { UsersThree } from 'phosphor-svelte';

	export let user: any;
	export let orgs: any;
</script>

<div class="flex md:flex-row flex-col flex-wrap gap-5">
	<div class="">
		<img
			src={user.avatar_url}
			class="h-80 w-80 mx-auto object-cover rounded-full border-2"
			alt={`${user.login} avatar`}
			aria-label={`${user.login} avatar`}
		/>
	</div>
	<div class="flex flex-col flex-1 gap-1.5">
		<h1 class="text-3xl font-bold tracking-wide inline-flex items-center gap-2">
			{user.name}
			<a
				href={user.html_url}
				target="_blank"
				rel="noopener noreferrer"
				aria-label="View Github profile"
			>
				(@{user.login})
			</a>
		</h1>
		{#if user.bio}
			<p>
				{user.bio}
			</p>
		{/if}
		<div class="flex items-center gap-2">
			<UsersThree size="24" />
			<span class="flex items-center gap-1">
				<strong> {user.followers}</strong> followers <Dot /> <strong>{user.following}</strong> following
			</span>
		</div>
		{#if user.company}
			<span class="flex items-center"><Building2 class="w-5 h-5 mr-1.5" /> {user.company}</span>
		{/if}

		{#if user.blog}
			<a
				href={user.blog}
				target="_blank"
				class="text-base font-medium hover:underline flex items-center"
				rel="noopener noreferrer"
				aria-label={`Access ${user.blog}`}
			>
				<Link class="w-5 h-5 mr-1.5" />
				{user.blog}
			</a>
		{/if}
		{#if user.location}
			<span class="flex items-center"><MapPin class="w-5 h-5 mr-1.5" /> {user.location}</span>
		{/if}
		{#if orgs.length > 0}
			<div class="max-w-full">
				<h2 class="text-lg tracking-wide font-bold">Organizations</h2>
				<div class="flex flex-wrap items-center gap-1">
					{#each orgs as org}
						<div class="inline-flex items-center border px-2 py-1.5 rounded bg-background">
							<img
								src={org.avatar_url}
								alt={`${org.login} organization avatar`}
								class="h-6 w-6 rounded object-cover mr-2"
								aria-label={`${org.login} organization avatar`}
							/>
							<span class="text-base tracking-wide">{org.login}</span>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</div>
</div>
