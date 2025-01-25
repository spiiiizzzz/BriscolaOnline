import games from "$lib/server/games.js";

export function POST({url, cookies}) {
    const gameId = url.searchParams.get('gameId');
    const token = cookies.get('gameToken');
    
    if (!games[gameId]) {
        return new Response({
            status: 404
        })
    }
    
    const player = games[gameId].players.find(p => p.gameToken == token);
    
    if (!player.isHost || games[gameId].gameState !== "notstarted") {
        return new Response(null, {
            status: 401
        });
    }

    // Doesn't really make sense to look for the player to kick since it's only two players
    // just remove everyone who isn't the host
    games[gameId].players = games[gameId].players.filter(p => p.isHost);

    return new Response(null, {
        status: 200
    });
}