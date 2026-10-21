<script lang="ts">
    import { page } from '$app/stores';
    const items = [
        {
            label: "Home",
            route: "/",
        },
        {
            label: "Submission Form",
            route: "/submission",
        },
        {
            label: "Reporting",
            route: "/reporting",
        }
    ]
</script>

<nav class="sticky top-0 left-0 w-full bg-bg border-b border-border py-2 px-8 z-10">
    <ul class="flex flex-row list-none m-0 p-0 gap-4">
        {#each items as item}
            <li>
                <a class="font-bold text-xl text-text"
                    href={item.route}
                    class:active={$page.url.pathname === item.route}>
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