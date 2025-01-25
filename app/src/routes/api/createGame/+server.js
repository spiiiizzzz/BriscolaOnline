import games from '$lib/server/games.js'

export function POST({url, cookies}){
    const player = url.searchParams.get('player');

    const gameId = Math.random().toString(24).slice(2);

    const token = Math.random().toString(24).slice(2);

    let newGame = {
        id: gameId,
        players: [
            {
                name: player,
                gameToken: token,
                isHost: true,
                hand: [],
                scoredCards: [],
                score: 0,
                canPlay: false,
                playedCard: undefined,
                playedFirst: false,
                wonLastHand: false,
                lastUpdate: Date.now()
            }
        ],
        mainDeck: [],
        faceDownCard: undefined,
        briscola: undefined,
        gameState: "notstarted"
    };

    cookies.set('gameToken', token, {path: '/'} );

    games[gameId] = newGame;

    return new Response(null, {
        status: 302,
        headers: { 
            'location': `/games/${gameId}`,
        }
    });
}