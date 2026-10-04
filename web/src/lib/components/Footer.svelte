<script lang="ts">
    import { page } from '$app/stores';
    const items = [
        {
            label: "Home",
            route: "/",
        },
        {
            label: "Reporting",
            route: "/reporting",
        }
    ]
</script>

<div class="border-t border-slate-200 bg-slate-50 px-6 py-6">
  <div class="mx-auto flex max-w-4xl flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
    <img
      src="/images/ACET_logo.png"
      alt="ACET Attribution"
      width="100"
      class="shrink-0 opacity-90"
    />

    <div class="space-y-2 text-sm leading-relaxed text-slate-600">

      <p>
        This research was undertaken thanks in part to funding from the Canada First Research Excellence Fund, as part of the University of Victoria-led Accelerating Community Energy Transformation (ACET) Initiative.
      </p>

      <p class="text-xs text-slate-500">
        CC BY 4.0 — This work is licensed under a
        <a
          href="https://creativecommons.org/licenses/by/4.0/"
          class="underline decoration-slate-300 underline-offset-2 hover:decoration-slate-500"
        >
          Creative Commons Attribution 4.0 International License
        </a>.
      </p>
    </div>
  </div>
</div>

<style>
    @import "tailwindcss";
    
    
</style>