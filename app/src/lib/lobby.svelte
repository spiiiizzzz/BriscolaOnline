<script>

    let {info = $bindable(), startCallback} = $props();

    let players = $derived(info.players);

    let player = $derived(info.players.find(p => p.isCaller));

    async function kick(){
        await fetch(`/api/kickPlayer/?gameId=${info.gameId}`, {
            method: "POST"
        });
    }

</script>

<main>
    <div class="content">
        <h1 style="color: white;">Players</h1>
        <table>
            {#each info.players as p}
                <tbody>
                    <tr>
                        <td>{p.isHost ? "[Host] " : ""}{p.name}</td>
                        {#if !p.isHost && player.isHost}
                            <td>
                                <button class="kick-button" onclick={kick}>kick</button>
                            </td>
                        {/if}
                    </tr>
                </tbody>
            {/each}
        </table>
    
        <button disabled={!player.isHost || players.length < 2} onclick="{startCallback}">Start</button>
    </div>
</main>

<style>
    table {
        background-color: white;
        color: black;
        width: 75%;
        border-radius: 10px;
    }

    td {
        padding: 0.5em;
    }

    .content {
        margin-top: 10%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    button {
        background-color: black;
        color: white;
        padding: 0.5em;
        border-style: none;
        border-radius: 10px;
        margin-top: 1em;
        font-size: 20px;
        width: 75%;
        cursor: pointer;
    }

    button:hover {
        background-color: darkgray;
        color: black;
    }

    button:disabled {
        color: gray;
    }
    
    .kick-button {
        padding: 0.1em;
        background-color: red;
        color: white;
    }

    .kick-button:hover {
        background-color: rgb(255, 199, 199);
        color: red;
    }
</style>