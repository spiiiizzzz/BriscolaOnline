<script>
    let {isCovered, cards = $bindable(), fallbackCount = $bindable(), isBriscola = $bindable(false)} = $props();

    let count = $derived(cards ? cards.length : undefined);
</script>

<main class="content">
    <div class="{isCovered ? "covered" : "uncovered"} {(count === 0 || (!cards && !fallbackCount)) ? "absent" : ""}">
        {#if isCovered}
            <p class="counter">{fallbackCount}</p>
        {:else if Array.isArray(cards)}
            {#if count > 0}
                <img class="card-face" src="/cards/{cards[count-1].suit}/{cards[count-1].rank}.png" alt="{cards[count-1].suit}/{cards[count-1].rank}">
            {/if}
        {:else}
            {#if cards}
                <img class="card-face" src="/cards/{cards.suit}/{cards.rank}.png" alt="{cards.suit}/{cards.rank}">
            {/if}
        {/if}
    </div>
</main>

<style>
    .content {
        padding: 10%;
    }

    .counter {
        position: absolute;
        top: 17%;
        left: 43%;
        color: black;
        font-size: 40px;
    }

    .covered, .uncovered, .absent {
        border-radius: 10px;
        width: 7em;
        height: 11em;
    }

    .covered {
        background-color: darkgray;
        -webkit-box-shadow:inset 0px 0px 0px 10px #fff;
        -moz-box-shadow:inset 0px 0px 0px 10px #fff;
        box-shadow:inset 0px 0px 0px 10px #fff;
    }

    .absent {
        background: rgba(0, 0, 0, 0.2) !important;
        box-shadow: 0px 0px 0px 0px #fff;
    }

    .uncovered {
        background-color: white;
    }

    .card-face {
        width: 100%;
        height: 115%; /* used to compensate the bad cropping i did with the images of the cards */
    }
</style>