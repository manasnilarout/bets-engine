import fetch, { Response } from 'node-fetch';

import { config } from '../config';
import { env } from '../env';

const delay = (seconds: number) => new Promise(resolve => setTimeout(resolve, seconds * 1000));

const getContinuosScores = async () => {
    while (true) {
        try {
            const cricketGames = `https://api.b365api.com/v1/bet365/inplay_filter?sport_id=${config.get('betsEngine.sports.cricket')}&token=${env.betsEngine.token}`;
            const response: Response = await fetch(cricketGames);
            const games = await getResults(response);
            const gameIds = games.map(game => game.id);
            console.log(`Got games, results count => ${games.length}`);
            const scoreApis = gameIds.map(id => `https://api.b365api.com/v1/bet365/event?token=${env.betsEngine.token}&FI=${id}`);
            for (const scoreApi of scoreApis) {
                const score: Response = await fetch(scoreApi);
                const gameScore = await getResults(score);
                console.log(`Got scores, results count => ${gameScore[0].length}`);
            }
            await delay(config.get('betsEngine.delayInScoreFetchInSeconds'));
        } catch (err) {
            console.log(err);
        }
    }
};

const getResults = async (apiResponse: Response): Promise<any[]> => {
    const response = await apiResponse.json();

    if (response.success) {
        return response.results;
    }

    throw new Error(response.error);
};

export const scoreLoader = async () => {
    getContinuosScores();
};
