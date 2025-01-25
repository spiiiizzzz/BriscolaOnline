import games from '$lib/server/games.js';
import { redirect } from '@sveltejs/kit';

export async function load({ params, cookies }){
    const gameId = params.slug;
    const token = cookies.get('gameToken');

    if (games[gameId] === undefined) throw redirect(302, '/errors/notfound');

    if (games[gameId].gameState != "notstarted" && !games[gameId].players.find((p) => p.gameToken === token) ) throw redirect(302, '/errors/gamestarted');
    if (games[gameId].players.length >= 2 && !games[gameId].players.find((p) => p.gameToken === token)) throw redirect(302, '/errors/gamefull');

    if (!games[gameId].players.find((p) => p.gameToken === token))
        throw redirect(302, `/setname/${gameId}`);
} 