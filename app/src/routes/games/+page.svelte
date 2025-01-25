<script>
    import { goto } from "$app/navigation";

    let player = $state('');
    let gameId = $state('');

    async function createGame() {
        if (!player) {
            return;
        }

        const res = await fetch(`/api/createGame/?player=${player}`, {
            method: "POST",
        });

        goto(res.url);
    }

    async function joinGame() {
        if (!player && !gameId) {
            return;
        }

        const res = await fetch(`/api/joinGame/?player=${player}&gameId=${gameId}`, {
            method: "POST",
        });

        if (res.status === 404) return;

        goto(res.url);
    }
</script>

<main>
    <div class="content">
        <h1 style="color: white;" >Join a game</h1>

        <form class="join-form">
            <input placeholder="Name" type="text" name="playerName" id="playerName" required bind:value={player}>
            <input placeholder="game ID" type="text" name="gameId" id="gameId" bind:value={gameId}>
            <div class="buttons">
                <button style="margin-right: 0.1em;" onclick={createGame}>New Game</button>
                <button style="margin-left: 0.1em;" onclick={joinGame}>Join Game</button>
            </div>
        </form>
    </div>
</main>

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

    .buttons {
        display: flex;
        flex-direction: row;
        width: 100%;
    }

    .buttons > button {
        background-color: black;
        color: white;
        padding: 0.5em;
        border-style: none;
        border-radius: 10px;
        margin-top: 0.1em;
        margin-bottom: 0.1em;
        font-size: 20px;
        width: 50%;
        cursor: pointer;
    }

    .buttons > button:hover {
        background-color: darkgray;
        color: black;
    }
</style>