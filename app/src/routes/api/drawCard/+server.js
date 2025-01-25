import games from '$lib/server/games.js';

function playerCanDraw(player, gameId) {
    if (player.hand.length >= 3) return false;
    const opponent = games[gameId].players.find((p) => p.gameToken !== player.gameToken);
    if (games[gameId].gameState === "setup") {
        if (player.isHost && player.hand.length >= opponent.hand.length) return false;
        if (!player.isHost && player.hand.length != opponent.hand.length) return false;
        return true;
    } else if (games[gameId].gameState === "draw") {
        if (player.hand.length === opponent.hand.length && player.wonLastHand) return true;
        if (player.hand.length < opponent.hand.length) return true;
        return false;
    }
    return false;
}

export function POST({url, cookies}) {
    const gameId = url.searchParams.get('gameId');
    const token = cookies.get('gameToken');

    if (!games[gameId]) {
        return new Response({
            status: 404
        })
    }

    const player = games[gameId].players.find(p => p.gameToken == token);
    const opponent = games[gameId].players.find((p) => p.gameToken !== player.gameToken);

    if (!playerCanDraw(player, gameId)) {
        return new Response(null, {
            status: 401
        });
    }


    let card = undefined;
    if (games[gameId].mainDeck.length > 0){
        card = games[gameId].mainDeck.pop();
    } else if (games[gameId].faceDownCard) {
        card = games[gameId].faceDownCard;
        games[gameId].faceDownCard = undefined;
    } else {
        return new Response(null, {
            status: 400
        });
    }

    games[gameId].players[games[gameId].players.indexOf(player)].hand.push(card);

    if (games[gameId].gameState === "draw" && games[gameId].players[games[gameId].players.indexOf(player)].hand.length === games[gameId].players[games[gameId].players.indexOf(opponent)].hand.length){
        games[gameId].gameState = "play";
    }

    return new Response(null, {
        status: 200
    });
}