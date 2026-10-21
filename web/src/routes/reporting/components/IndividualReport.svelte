<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";

    let { emails, reports }:  {
        emails?: string[]
        reports: null | {
            general?: {
                coursesTaughtCount?: number
                resourceCount?: number
                resourceTypeCount?: number
            }
            studentsTaught?: { year: number, total: number}[]
            resourceDiversityReport?: { type: string, total: number }[] // TODO: Move resourceCount et al to this
        }
    } = $props()

    const selected = $derived(page.url.searchParams.get('email') ?? '');
    
    function select(value: string) {
        const url = new URL(page.url);
        const trimmed = value.trim();

        if (trimmed) url.searchParams.set('email', trimmed);
        else url.searchParams.delete('email');

        goto(url, { keepFocus: true, noScroll: true, replaceState: true });
    }
</script>

<div class="flex flex-col gap-2">
    <div>
        <label for="reporting-type" class="tag">Email</label>
        <select 
            class="field field-select"
            name="reporting-type"
            id="reporting-type"
            value={selected}
            onchange={(e) => select(e.currentTarget.value)}
        >
            <option value='' selected disabled hidden>Please choose an option</option>
            {#each emails as email}
                <option value={email}>{email}</option>
            {/each}
        </select>
    </div>

    {#if reports && reports['general']}

        <h3>At a glance</h3>

        <dl class="stats">
            <div class="stat">
                <dt>Courses Taught</dt>
                <dd>{reports.general.coursesTaughtCount ?? '0'}</dd>
            </div>
            <div class="stat">
                <dt>Resources Used</dt>
                <dd>{reports.general.resourceCount ?? '0'}</dd>
            </div>
            <div class="stat">
                <dt>Unique Types</dt>
                <dd>{reports.general.resourceTypeCount ?? '0'}</dd>
            </div>
        </dl>

    {/if}

    {#if reports && reports['studentsTaught']}

        <h3>Students taught</h3>

        {#if reports['studentsTaught'].length === 0}
            <p>No results found...</p>
        {:else}
            <div class="overflow-x-auto rounded-lg border border-gray-200 shadow-sm w-fit">
                <table class="w-auto text-sm">
                    <tbody class="divide-y divide-gray-200 bg-white">
                        <tr>
                            <th scope="row" class="whitespace-nowrap bg-gray-50 px-4 py-3 text-left font-semibold text-gray-600">
                                Year
                            </th>
                            {#each reports['studentsTaught'] as d}
                                <td class="px-4 py-3 text-center font-medium text-gray-900">{d.year}</td>
                            {/each}
                        </tr>
                        <tr>
                            <th scope="row" class="whitespace-nowrap bg-gray-50 px-4 py-3 text-left font-semibold text-gray-600">
                                No. Students
                            </th>
                            {#each reports['studentsTaught'] as d}
                                <td class="px-4 py-3 text-center tabular-nums text-gray-700">{d.total}</td>
                            {/each}
                        </tr>
                    </tbody>
                </table>
            </div>
        {/if}
    {/if}

    {#if reports && reports['resourceDiversityReport']}

        <h3>Students taught</h3>

        {#if reports.resourceDiversityReport.length === 0}
            <p>No results found...</p>
        {:else}
            <div class="w-fit overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                <table class="text-left text-sm">
                    <thead class="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-600">
                        <tr>
                            <th class="px-4 py-3">Resource Type</th>
                            <th class="px-4 py-3 text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200 bg-white">
                        {#each reports.resourceDiversityReport as row (row.type)}
                            <tr class="hover:bg-gray-50">
                                <td class="px-4 py-3 font-medium text-gray-900">{row.type}</td>
                                <td class="px-4 py-3 text-right tabular-nums text-gray-700">{row.total}</td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        {/if}
    {/if}

</div>