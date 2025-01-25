import games from '$lib/server/games.js';
import { json } from '@sveltejs/kit';

export function GET({url, cookies}){
    const gameId = url.searchParams.get('gameId');

    const token = cookies.get('gameToken');

    if (!games[gameId]) {
        return new Response(null, {
            status: 404
        });
    }

    if (games[gameId].players.map(p => p.gameToken).indexOf(token) === -1){
        return new Response(null, {
            status: 401
        });
    }

    games[gameId].players[games[gameId].players.map(p => p.gameToken).indexOf(token)].lastUpdate = Date.now();

    const info = {
        gameId: gameId,
        players: games[gameId].players.map((p) => {return {
            name: p.name, 
            hand: p.gameToken == token ? p.hand : p.hand.map((_) => { return {
                suit: undefined,
                rank: undefined
            }}),
            isHost: p.isHost,
            isCaller: p.gameToken == token,
            scoredCards: p.scoredCards,
            score: p.score,
            canPlay: p.canPlay,
            playedCard: p.playedCard,
            playedFirst: p.playedFirst,
            wonLastHand: p.wonLastHand
        }}),
        remainingCards: games[gameId].mainDeck.length,
        faceDownCard: games[gameId].faceDownCard,
        briscola: games[gameId].briscola,
        gameState: games[gameId].gameState
    };

    return json(info);
}