import games from '$lib/server/games.js';

function playerCanSetBriscola(player, gameId) {
    if (player.hand.length != 3) return false;
    if (!player.isHost) return false;
    if (games[gameId].gameState != "setup") return false;
    return true;
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

    if (!playerCanSetBriscola(player, gameId)) {
        return new Response(null, {
            status: 401
        });
    }

    games[gameId].faceDownCard = games[gameId].mainDeck.pop();
    games[gameId].briscola = games[gameId].faceDownCard.suit;
    games[gameId].gameState = "play";
    games[gameId].players[games[gameId].players.indexOf(games[gameId].players.find(p => p.gameToken != token))].canPlay = true;

    return new Response(null, {
        status: 200
    });
}