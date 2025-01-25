<script>
    import Game from "$lib/game.svelte";
    import Lobby from "$lib/lobby.svelte";
    import { onDestroy, onMount } from "svelte";
    import { page } from "$app/state";
    import { goto } from "$app/navigation";

    let info = $state(undefined);
    let updateInterval = $state(0);

    onMount(() => {
        updateInterval = setInterval(async () => {
            const res = await fetch(`/api/getGameInfo/?gameId=${page.params.slug}`);

            if (res.ok) {
                const data = await res.json()
                info = data;
            }

            if (!res.status == 401) goto('/errors/kicked');

        }, 1000);
    })

    onDestroy(() => {
        clearInterval(updateInterval);
    })

    async function startCallback() {
        const res = await fetch(`/api/startGame/?gameId=${page.params.slug}`, {
            method: "POST"
        });
    }
</script>

<main>
    {#if !info}
        <p>loading...</p>
    {:else if info.gameState != "notstarted"}
        <Game bind:info={info} />
    {:else}
        <Lobby bind:info={info} startCallback={startCallback}/>
    {/if}
</main>

<style>

</style>