<!-- src/routes/+page.svelte -->
<script lang="ts">
  import MiniSearch from 'minisearch';
  import type { Staff } from '$lib/types';

  let query = $state('');
  let index = $state.raw<MiniSearch<Staff>>();
  let loading = $state(false);

  async function ensureIndex() {
    if (index || loading) return;
    loading = true;
    try {
      const res = await fetch('/data/staff.json');
      const rows: Omit<Staff, 'id'>[] = await res.json();

      const mini = new MiniSearch<Staff>({
        fields: ['name'],
        storeFields: ['name', 'rank', 'faculty_id', 'unit_id'],
        searchOptions: { prefix: true, fuzzy: 0.2 }
      });
      mini.addAll(rows.map((r, i) => ({ id: i, ...r })));
      index = mini;
    } finally {
      loading = false;
    }
  }

  const results = $derived(
    index && query.trim().length >= 2
      ? (index.search(query.trim()).slice(0, 20) as unknown as Staff[])
      : []
  );
</script>

<input bind:value={query} onfocus={ensureIndex} placeholder="Search professors" />

{#if loading}
  <p>Loading…</p>
{/if}

<ul>
  {#each results as person (person.id)}
    <li>{person.name}</li>
  {/each}
</ul>