import games from '$lib/server/games.js';
import {firstScored} from '$lib/scoreFunction.js';

export function POST({url, cookies}){
    const gameId = url.searchParams.get('gameId');
    const token = cookies.get('gameToken');

    if (!games[gameId]) {
        return new Response({
            status: 404
        })
    }
    
    const player = games[gameId].players.find(p => p.gameToken == token);
    
    if (!player.isHost || games[gameId].gameState !== "confront") {
        return new Response(null, {
            status: 401
        });
    }

    const opponent = games[gameId].players.find((p) => p.gameToken !== player.gameToken);

    if (player.playedFirst) {
        if (firstScored(player.playedCard, opponent.playedCard, games[gameId].briscola)) {
            games[gameId].players[games[gameId].players.indexOf(player)].scoredCards.push(player.playedCard);
            games[gameId].players[games[gameId].players.indexOf(player)].scoredCards.push(opponent.playedCard);
            games[gameId].players[games[gameId].players.indexOf(player)].wonLastHand = true;
            games[gameId].players[games[gameId].players.indexOf(opponent)].wonLastHand = false;
        } else {
            games[gameId].players[games[gameId].players.indexOf(opponent)].scoredCards.push(player.playedCard);
            games[gameId].players[games[gameId].players.indexOf(opponent)].scoredCards.push(opponent.playedCard);
            games[gameId].players[games[gameId].players.indexOf(opponent)].wonLastHand = true;
            games[gameId].players[games[gameId].players.indexOf(player)].wonLastHand = false;
        }
        games[gameId].players[games[gameId].players.indexOf(player)].playedFirst = false;
        games[gameId].players[games[gameId].players.indexOf(player)].playedCard = undefined;
        games[gameId].players[games[gameId].players.indexOf(opponent)].playedCard = undefined;
    } else {
        if (firstScored(opponent.playedCard, player.playedCard, games[gameId].briscola)) {
            games[gameId].players[games[gameId].players.indexOf(opponent)].scoredCards.push(player.playedCard);
            games[gameId].players[games[gameId].players.indexOf(opponent)].scoredCards.push(opponent.playedCard);
            games[gameId].players[games[gameId].players.indexOf(opponent)].wonLastHand = true;
            games[gameId].players[games[gameId].players.indexOf(player)].wonLastHand = false;
        } else {
            games[gameId].players[games[gameId].players.indexOf(player)].scoredCards.push(player.playedCard);
            games[gameId].players[games[gameId].players.indexOf(player)].scoredCards.push(opponent.playedCard);
            games[gameId].players[games[gameId].players.indexOf(player)].wonLastHand = true;
            games[gameId].players[games[gameId].players.indexOf(opponent)].wonLastHand = false;
        }
        games[gameId].players[games[gameId].players.indexOf(opponent)].playedFirst = false;
        games[gameId].players[games[gameId].players.indexOf(player)].playedCard = undefined;
        games[gameId].players[games[gameId].players.indexOf(opponent)].playedCard = undefined;
    }
    
    games[gameId].players[0].canPlay = games[gameId].players[0].wonLastHand;
    games[gameId].players[1].canPlay = games[gameId].players[1].wonLastHand;

    if (games[gameId].players[0].hand.length === 0 
        && games[gameId].players[1].hand.length === 0
        && games[gameId].mainDeck.length === 0
        && games[gameId].faceDownCard === undefined) {

        games[gameId].gameState = "calculate";
    } else if (games[gameId].players[0].hand.length !== 0 
        && games[gameId].players[1].hand.length !== 0
        && games[gameId].mainDeck.length === 0
        && games[gameId].faceDownCard === undefined) {

        games[gameId].gameState = "play";
    } else {
        games[gameId].gameState = "draw";
    }

    return new Response(null, {
        status: 200
    });
}