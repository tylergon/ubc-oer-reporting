<script lang="ts">
	import './app.css'
	import favicon from '$lib/assets/favicon.svg';
	import TopNav from '$lib/components/Nav.svelte';
	import Footer from '$lib/components/Footer.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<TopNav />

<div class="max-w-5xl mx-auto py-6 flex flex-col gap-2">
	{@render children()}
</div>

<Footer />