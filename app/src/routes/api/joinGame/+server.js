import games from '$lib/server/games.js'

export function POST({url, cookies}){
    const player = url.searchParams.get('player');

    const gameId = url.searchParams.get('gameId');

    const game = games[gameId];

    if (!game) {
        return new Response(null, {
            status: 404
        })
    }

    if (game.players.length >= 2) {
        return new Response(null, {
            status: 401
        })
    }

    const token = Math.random().toString(24).slice(2);

    cookies.set('gameToken', token, {path: '/'} );
    
    games[gameId].players.push({
        name: player,
        gameToken: token, 
        isHost: false,
        hand: [],
        scoredCards: [],
        score: 0,
        canPlay: false,
        playedCard: undefined,
        playedFirst: false,
        wonLastHand: false,
        lastUpdate: Date.now()
    });


    return new Response(null, {
        status: 302,
        headers: { 
            'location': `/games/${gameId}`
        }
    })
}