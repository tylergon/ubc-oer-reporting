<script lang="ts">
	import './app.css';
	import favicon from '$lib/assets/favicon.svg';
	import TopNav from '$lib/components/Nav.svelte';
	import Footer from '$lib/components/Footer.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="flex min-h-dvh flex-col">
	<TopNav />

	<main class="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-2 py-6">
		{@render children()}
	</main>

	<Footer />
</div>
