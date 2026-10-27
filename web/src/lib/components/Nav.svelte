<script lang="ts">
	import { page } from '$app/stores';
	const items = [
		{
			label: 'Home',
			route: '/'
		},
		{
			label: 'Submission Form',
			route: '/submission'
		},
		{
			label: 'Reporting',
			route: '/reporting'
		}
	];
</script>

<nav class="bg-bg border-border sticky top-0 left-0 z-10 w-full border-b px-8 py-2">
	<ul class="m-0 flex list-none flex-row gap-4 p-0">
		{#each items as item}
			<li>
				<a
					class="text-text text-xl font-bold"
					href={item.route}
					class:active={$page.url.pathname === item.route}
				>
					{item.label}
				</a>
			</li>
		{/each}
	</ul>
</nav>

<style>
	a:hover {
		color: var(--font-heading);
	}
</style>
