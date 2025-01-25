<script>
    let {isPlayer, cards = $bindable(), canPlay = $bindable(), isHost = $bindable(), gameId, gameState = $bindable()} = $props()

    let selectedCard = $state(undefined);

    async function playCard(){
        if (canPlay && selectedCard != undefined) {
            await fetch(`/api/playCard/?gameId=${gameId}&index=${selectedCard}`, {
                method: "POST"
            });
        }
        selectedCard = undefined;
    }

    async function stopGame(){
        if (isHost) {
            await fetch(`/api/stopGame/?gameId=${gameId}`, {
                method: "POST"
            });
        }
    }

    function selectCard(index){
        if (selectedCard === index) {
            selectedCard = undefined;
        } else {
            selectedCard = index;
        }
    }
</script>

<main>
    <div class="hand">
        {#each cards as card, index}
            {#if isPlayer}
                <!--TODO eventually: make this clickable div accessible to screen readers-->
                <div
                    style="z-index: {3-index}; 
                            transform: rotate({-10+index*10}deg); 
                            margin-top: {index % 2 == 0 ? "20px" : "0px"};"
                    class="uncovered {selectedCard == index ? "selected" : ""}" 
                    onclick="{() => {selectCard(index)}}"
                >
                    <img class="card-face" src="/cards/{card.suit}/{card.rank}.png" alt="{card.suit}/{card.rank}">
                </div>
            {:else}
                <div 
                    style="z-index: {index}; 
                        transform: rotate({10-index*10}deg); 
                        margin-top: {index % 2 == 0 ? "-20px" : "0px"};"
                    class="covered"
                ></div>
            {/if}
        {/each}
        {#if isPlayer && cards.length > 0}
            <button class="play-button" onclick="{playCard}" disabled={(!canPlay) || gameState != "play"}>Play</button>
            <button class="play-button" onclick="{stopGame}" hidden={(!isHost)}>Stop</button>
        {/if}
    </div>
</main>

<style>
    .hand {
        display: flex;
        flex-direction: row;
    }

    .selected {
        border-style: solid;
        border-width: 5px;
        border-color: cyan;
    }

    .covered, .uncovered {
        border-radius: 10px;
        width: 7em;
        height: 11em;
    }
    
    .covered {
        background-color: darkgray;
        -webkit-box-shadow:inset 0px 0px 0px 10px #fff;
        -moz-box-shadow:inset 0px 0px 0px 10px #fff;
        box-shadow:inset 0px 0px 0px 10px #fff, 2px 2px 5px #000;
    }
    
    .uncovered {
        background-color: white;
        box-shadow: 2px 2px 5px;
        cursor: pointer;
    }

    .card-face {
        width: 100%;
        height: 115%; /* used to compensate the bad cropping i did with the images of the cards */
    }

    .play-button {
        height: fit-content;
        position: relative;
        top: 3em;
        margin-left: 1em;
        font-size: 30px;
        color: white;
        background-color: red;
        border-style: solid;
        border-radius: 10px;
        cursor: pointer;
    }

    .play-button:disabled {
        background-color: darkgray;
        color: gray;
    }

</style>