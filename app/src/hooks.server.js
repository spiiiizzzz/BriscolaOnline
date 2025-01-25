import games from "$lib/server/games.js";
import {setTimeout} from "timers/promises";

async function checkForDeadGames() {
    while (true) {
        await setTimeout(10000);
    
        for (let game in games) {
            for (let player of games[game].players) {
                if (Date.now() - player.lastUpdate > 30*1000) {
                    games[game].players = games[game].players.filter(p => p != player);
                }
            }

            if (games[game].players.length === 0) {
                console.log("deleting game: ", game);
                delete games[game];
            }
        }
    }
}

checkForDeadGames();