<script lang="ts">
  import FacultyReport from "./components/FacultyReport.svelte";
  import IndividualReport from "./components/IndividualReport.svelte";

    
    type reportTypes = 'individual' | 'faculty'
    let type: reportTypes = $state('individual')
    
    let { data } = $props()
    
    $inspect(data)
</script>

<h1>Reporting</h1>

<p>Here's all the reporting stuff!</p>

<div>
    <label for="reporting-type" class="tag">Report Type</label>
    <select class="field field-select"
            name="reporting-type"
            id="reporting-type"
            bind:value={type}>
        <option value='individual'>Individual</option>
        <option value='faculty'>Faculty</option>
    </select>
</div>

{#if type === 'individual'}
    <div>
        <IndividualReport emails={data.emails} reports={data.individual} />
    </div>
    {:else if type === 'faculty'}
    <div>
        <FacultyReport />
    </div>
{/if}