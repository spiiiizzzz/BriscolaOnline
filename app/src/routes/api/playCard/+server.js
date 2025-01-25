import games from '$lib/server/games.js';

export function POST({url, cookies}) {
    const gameId = url.searchParams.get('gameId');
    const index = url.searchParams.get('index');
    const token = cookies.get('gameToken');

    if (!games[gameId]) {
        return new Response({
            status: 404
        })
    }
    
    const player = games[gameId].players.find(p => p.gameToken == token);
    
    if (!(player.canPlay && index >= 0 && index < 3)) {
        return new Response(null, {
            status: 401
        });
    }
    
    games[gameId].players[games[gameId].players.indexOf(player)].playedCard = games[gameId].players[games[gameId].players.indexOf(player)].hand[index];
    games[gameId].players[games[gameId].players.indexOf(player)].hand.splice(index, 1);
    games[gameId].players[games[gameId].players.indexOf(player)].canPlay = false;
    const opponent = games[gameId].players.find((p) => p.gameToken !== player.gameToken);
    games[gameId].players[games[gameId].players.indexOf(opponent)].canPlay = true;
    if (!games[gameId].players[games[gameId].players.indexOf(opponent)].playedFirst)
        games[gameId].players[games[gameId].players.indexOf(player)].playedFirst = true;

    if (games[gameId].players[games[gameId].players.indexOf(player)].hand.length === games[gameId].players[games[gameId].players.indexOf(opponent)].hand.length
        && games[gameId].gameState === "play") {

        games[gameId].players[games[gameId].players.indexOf(opponent)].canPlay = false;
        games[gameId].gameState = "confront";
    }
    
    return new Response(null, {
        status: 200
    })
}