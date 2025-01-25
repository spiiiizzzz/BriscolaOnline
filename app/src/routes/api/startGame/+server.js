import games from '$lib/server/games.js';

// fisher-yates shuffle stolen from stackoverflow cause why not
function shuffle(array) {
    let currentIndex = array.length;
  
    while (currentIndex != 0) {
  
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
    
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
}
  

export function POST({url, cookies}){
    const gameId = url.searchParams.get('gameId');

    const token = cookies.get('gameToken');

    if (!games[gameId]) {
        return new Response(null, {
            status: 404
        });
    }

    if (!games[gameId].players.find(p => p.gameToken == token).isHost) {
        return new Response(null, {
            status: 401
        });
    }

    if (games[gameId].players < 2){
        return new Response(null, {
            status: 400
        });
    }

    games[gameId].gameStarted = true;
    // using the english names for the suits
    for (let suit of ["swords", "coins", "cups", "batons"]){
        for (let rank of [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]){
            games[gameId].mainDeck.push({
                suit: suit,
                rank: rank
            });
        }
    }
    shuffle(games[gameId].mainDeck);
    games[gameId].briscola = undefined;
    games[gameId].gameState = "setup";
    games[gameId].players[0].scoredCards = [];
    games[gameId].players[1].scoredCards = [];

    return new Response(null, {
        status: 200
    });
}