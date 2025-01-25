<script>
    import Hand from "$lib/hand.svelte"
    import Deck from "$lib/deck.svelte"
    import { onMount } from "svelte";
    import {firstScored, score} from "./scoreFunction";

    let {info = $bindable()} = $props()

    let player = $derived(info.players.find((p) => p.isCaller));
    let opponent = $derived(info.players.find((p) => !p.isCaller));

    // purpose of this thing is to make sure the front end makes only ONE call to scoreHand and finishGame
    let shouldConfront = $state(false);
    let shouldFinish = $state(false);

    let playerWin = $state(undefined);

    onMount(async () => {
        setInterval(async () => {
            switch (info.gameState) {
                case "notstarted":
                    return;
                case "setup":
                    shouldFinish = true;
                    if (player.isHost && player.hand.length === 3) {
                        await fetch(`/api/setBriscola/?gameId=${info.gameId}`, {
                            method: "POST"
                        });
                    } else if (!player.isHost && player.hand.length === opponent.hand.length && player.hand.length < 3) {
                        await fetch(`/api/drawCard/?gameId=${info.gameId}`, {
                            method: "POST"
                        });
                    } else if (player.isHost && player.hand.length < opponent.hand.length && player.hand.length < 3) {
                        await fetch(`/api/drawCard/?gameId=${info.gameId}`, {
                            method: "POST"
                        });
                    }
                    break;
                case "play":
                    shouldConfront = true;
                    break;
                case "confront":
                    if (player.isHost && shouldConfront) {
                        setTimeout(async () => {
                            await fetch(`/api/scoreHand/?gameId=${info.gameId}`, {
                                method: "POST"
                            })
                        }, 2000); // timeout could be less
                    }
                    shouldConfront = false;
                    break;
                case "draw":
                    if (player.hand.length === opponent.hand.length && player.wonLastHand) {
                        await fetch(`/api/drawCard/?gameId=${info.gameId}`, {
                            method: "POST"
                        });
                    } else if (player.hand.length < opponent.hand.length) {
                        await fetch(`/api/drawCard/?gameId=${info.gameId}`, {
                            method: "POST"
                        });
                    }
                    break;
                case "calculate":
                    if (shouldFinish){
                        console.log("hit");
                        playerWin = winner();
                    }
                    if (player.isHost && shouldFinish) {
                        setTimeout(async () => {
                            await fetch(`/api/finishGame/?gameId=${info.gameId}`, {
                                method: "POST"
                            });
                        }, 3000); // timeout could be more
                    }
                    shouldFinish = false;
                    break;
            }
        }, 1000);
    })

    function scoredPlayer(){
        if (player.playedFirst && firstScored(player.playedCard, opponent.playedCard, info.briscola))
            return player.name;
        if (player.playedFirst && !firstScored(player.playedCard, opponent.playedCard, info.briscola))
            return opponent.name;
        if (opponent.playedFirst && firstScored(opponent.playedCard, player.playedCard, info.briscola))
            return opponent.name;
        if (opponent.playedFirst && !firstScored(opponent.playedCard, player.playedCard, info.briscola))
            return player.name;
    }

    function winner(){
        let scorePlayer = score(player.scoredCards), scoreOpponent = score(opponent.scoredCards);

        if (scorePlayer == scoreOpponent) {
            return null;
        } else if (scorePlayer > scoreOpponent){
            return player.name;
        } else {
            return opponent.name;
        }
    }
</script>

<main class="content">
    {#if info.gameState === "confront"}
        <p class="modal-info">
            {scoredPlayer()} scored!
        </p>
    {/if}
    {#if info.gameState === "calculate" && playerWin !== undefined}
        <p class="modal-info">
            {playerWin === null ? "It's a Draw!" : playerWin + " won!"}
        </p>
    {/if}
    <div class="hand-area">
        <Hand isPlayer={false} bind:cards={opponent.hand}/>
        <div class="scored-area">
            <Deck isCovered={false} bind:cards={opponent.scoredCards} fallbackCount={undefined}/>
            <p class="score-counter">{opponent.name}: {score(opponent.scoredCards)}</p>
        </div>
    </div>
    <div class="board-center">
        <div class="deck-area">
            <div class="main-deck">
                <Deck isCovered={true} cards={undefined} bind:fallbackCount={info.remainingCards}/>
            </div>
            <div class="briscola">
                <Deck isCovered={false} bind:cards={info.faceDownCard} fallbackCount={undefined} isBriscola={true}/>
            </div>
        </div>
        <div class="play-area">
            <Deck isCovered={false} cards={opponent.playedCard} />
            <Deck isCovered={false} cards={player.playedCard} />
        </div>
    </div>
    <div class="hand-area">
        <div class="scored-area">
            <p class="score-counter">{player.name}: {score(player.scoredCards)}</p>
            <Deck isCovered={false} bind:cards={player.scoredCards} fallbackCount={undefined}/>
        </div>
        <Hand isPlayer={true} bind:cards={player.hand} bind:canPlay={player.canPlay} bind:isHost={player.isHost} gameId={info.gameId} bind:gameState={info.gameState}/>
    </div>
</main>

<style>
    .content {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .board-center {
        display: flex;
        flex-direction: row;
    }

    .deck-area {
        position: relative; 
    }

    .main-deck {
        position: relative;
        top:7em;
        right:6em;
        z-index: 10;
    }

    .briscola {
        position: relative;
        bottom: 6em;
        right: 0em;
        transform: rotate(20deg);
    }

    .play-area {
        margin: 1em;
        display: flex;
        flex-direction: column;
    }

    .hand-area {
        display: flex;
        flex-direction: row;
    }

    .scored-area {
        margin-left:2em;
        margin-right: 2em;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .modal-info {
        position: fixed;
        z-index: 999;
        left: 35%;
        top: 25%;
        color: white;
        border-style: solid;
        background-color: black;
        border-radius: 10px;
        font-size: 50px;
    }

    .score-counter {
        font-size: 20px;
        color: white;
    }

</style>