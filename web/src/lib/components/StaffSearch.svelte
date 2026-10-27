<!-- src/routes/test/+page.svelte -->
<script lang="ts">
	import MiniSearch from 'minisearch';
	import type { Staff, StaffData } from '$lib/types';

	// Define input
	interface Props {
		value?: Staff;
	}
	let { value = $bindable() }: Props = $props();

	// Define state
	let open = $state(false);
	let query = $state('');
	let index = $state.raw<MiniSearch<{ name: string }>>();
	let loading = $state(false);
	let activeIndex = $state(0);
	let staff = $state<StaffData[]>([]);

	// Lookup matching professors
	const results = $derived(
		index && query.trim().length >= 2
			? (index.search(query.trim()).slice(0, 10) as unknown as StaffData[])
			: []
	);

	// Load the professors into a searchable list
	async function ensureIndex() {
		if (index || loading) return;
		loading = true;

		try {
			// Load professor data
			const res = await fetch('/data/staff.json');
			staff = await res.json();

			// Filter down to unique prof names & create search index
			const names = new Set(staff.map(({ name }) => name));
			const rows = Array.from(names).map((name) => ({ name }));
			const mini = new MiniSearch<{ name: string }>({
				fields: ['name'],
				storeFields: ['name'],
				searchOptions: { prefix: true, fuzzy: 0.2 }
			});
			mini.addAll(rows.map((r, i) => ({ id: i, ...r })));
			index = mini;
		} finally {
			loading = false;
		}
	}

	function close() {
		open = false;
		query = '';
	}

	function openList() {
		ensureIndex();
		open = true;
		query = '';
	}

	function onInput(e: Event) {
		query = (e.currentTarget as HTMLInputElement).value;
		console.log(`Setting query to "${query}"...`);
		open = true;
		activeIndex = 0;
	}

	function select(name: string) {
		// Look up the associated staff records
		const records = staff.filter((s) => s.name === name);
		value = {
			name,
			positions: records.map(({ name, ...rest }) => rest)
		};
		close();
	}

	function onKeydown(e: KeyboardEvent) {
		console.log(e);
		switch (e.key) {
			case 'ArrowDown':
				console.log('Down');
				e.preventDefault();
				if (!open) openList();
				else activeIndex = Math.min(activeIndex + 1, results.length - 1);
				break;
			case 'ArrowUp':
				e.preventDefault();
				if (!open) openList();
				else activeIndex = Math.max(activeIndex - 1, 0);
				break;
			case 'Enter':
				if (open && results[activeIndex]) {
					e.preventDefault();
					select(results[activeIndex].name);
				}
				break;
			case 'Escape':
				close();
				break;
		}
		console.log(activeIndex);
	}
</script>

<div class="relative w-full max-w-xs">
	<label for="select-professor" class="tag"> Search Professor </label>

	<input
		id="select-professor"
		type="text"
		role="combobox"
		aria-expanded={open}
		aria-controls="select-professor-options"
		aria-activedescendant={open && results.length ? `opt-{activeIndex}` : undefined}
		value={open ? query : (value?.name ?? '')}
		oninput={(e) => onInput(e)}
		onclick={() => !open && openList()}
		onfocus={() => {
			ensureIndex();
			openList();
		}}
		onblur={close}
		onkeydown={onKeydown}
		autocomplete="off"
		class="w-full rounded-md border border-gray-300 px-3 py-2
           focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-blue-500"
	/>

	{#if loading}
		<div
			class="absolute inset-x-0 z-10 mt-1 max-h-56 overflow-y-auto rounded-md border border-gray-300 bg-white p-1 shadow-md"
		>
			<p class="cursor-default px-2.5 py-1.5 text-gray-500">Loading…</p>
		</div>
	{/if}

	{#if !loading && open}
		<ul
			id="select-professor-options"
			role="listbox"
			class="absolute inset-x-0 z-10 mt-1 max-h-56 overflow-y-auto rounded-md
            border border-gray-300 bg-white p-1 shadow-md"
		>
			{#each results as opt, i (opt.name)}
				<!-- svelte-ignore a11y_click_events_have_key_events, a11y_interactive_supports_focus -->
				<li
					id="opt-{i}"
					role="option"
					aria-selected={opt.name === value?.name}
					class:active={i === activeIndex}
					onmousedown={(e) => e.preventDefault()}
					onclick={() => select(opt.name)}
					onmousemove={() => (activeIndex = i)}
					class="cursor-pointer rounded px-2.5 py-1.5 aria-selected:font-semibold"
					class:bg-blue-100={i === activeIndex}
				>
					{opt.name}
				</li>
			{:else}
				<li class="cursor-default px-2.5 py-1.5 text-gray-500" role="presentation">
					No matches found
				</li>
			{/each}
		</ul>
	{/if}
</div>
