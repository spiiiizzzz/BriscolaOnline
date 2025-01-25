<script>
    import { page } from "$app/state";
    import { goto } from "$app/navigation";

    let player = $state("");

    async function joinGame(){
        if (!player) {
            return;
        }


        const res = await fetch(`/api/joinGame/?player=${player}&gameId=${page.params.slug}`, {
            method: "POST",
        });

        if (res.status === 404) return;

        goto(res.url);
    }
</script>

<div class="content">
    <h1 style="color: white;">Type your name to join</h1>
    <form class="join-form">
        <input required bind:value={player} type="text" placeholder="Name">
        <button onclick="{joinGame}">Join game</button>
    </form>
</div>

<style>
    .content {
        margin-top: 10%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .join-form {
        display: flex;
        flex-direction: column;
        width: 75%;
    }

    .join-form > input {
        background-color: black;
        color: white;
        padding: 0.5em;
        border-style: none;
        border-radius: 10px;
        margin-top: 0.1em;
        margin-bottom: 0.1em;
        font-size: 20px;
    }

    button {
        background-color: black;
        color: white;
        padding: 0.5em;
        border-style: none;
        border-radius: 10px;
        margin-top: 0.1em;
        margin-bottom: 0.1em;
        font-size: 20px;
        width: 100%;
        cursor: pointer;
    }

    button:hover {
        background-color: darkgray;
        color: black;
    }
</style>