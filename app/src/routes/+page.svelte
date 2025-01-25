<script>
    import { goto } from "$app/navigation";
    import Game from "$lib/game.svelte"

    function play() {
        goto('/games');
    }
</script>

<main>
    <div class="content">
        <h1 class="title">Briscola Online</h1>
        <h3 class="subtitle">Cause I didn't really see any other implementations on the internet and i found that weird :P</h3>
        <div>
            <button onclick="{play}" class="button">Play!</button>
        </div>
    </div>
</main>

<style>
    .content {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        height: 100%;
    }

    .title {
        color: white;
        font-size: 70px;
    }

    .subtitle {
        color: white;
    }

    .button {
        margin-top: 2em;
        font-size: 40px;
        border-radius: 10px;
        border: none;
        color: white;
        background-color: black;
        padding: 10px;
        width: 5em;
        cursor: pointer;
    }

    .button:hover {
        background-color: darkgray;
        color: black;
    }
</style>
