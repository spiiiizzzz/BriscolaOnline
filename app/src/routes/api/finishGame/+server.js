import games from "$lib/server/games";

export function POST({url, cookies}) {
    const gameId = url.searchParams.get('gameId');
    const token = cookies.get('gameToken');

    if (!games[gameId]) {
        return new Response({
            status: 404
        })
    }
    
    const player = games[gameId].players.find(p => p.gameToken == token);
    
    if (!player.isHost || games[gameId].gameState !== "calculate") {
        return new Response(null, {
            status: 401
        });
    }

    games[gameId].gameState = "notstarted";

    games[gameId].players[0].score = 0;
    games[gameId].players[0].canPlay = false;
    games[gameId].players[0].playedCard = undefined;
    games[gameId].players[0].playedFirst = false;
    games[gameId].players[0].wonLastHand = false;

    games[gameId].players[1].score = 0;
    games[gameId].players[1].canPlay = false;
    games[gameId].players[1].playedCard = undefined;
    games[gameId].players[1].playedFirst = false;
    games[gameId].players[1].wonLastHand = false;

    return new Response(null, {
        status: 200
    });
}