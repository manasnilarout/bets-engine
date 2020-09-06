import fetch, { Response } from 'node-fetch';
import { Container } from 'typedi';

import { config } from '../config';
import { RedisDB } from '../utils/redis';
import { getIndividualGameStatsApi, getInPlayCricketsApi } from './scoreApis';

const delay = (seconds: number) => new Promise(resolve => setTimeout(resolve, seconds * 1000));
let redis: RedisDB;

const getResults = async (apiResponse: Response): Promise<any[]> => {
    const response = await apiResponse.json();

    if (response.success) {
        return response.results;
    }

    throw new Error(response.error);
};

const storeScoreKeys = async (key: string): Promise<void> => {
    const oldKeys = await redis.get('sKeys');

    if (oldKeys) {
        const value = JSON.parse(oldKeys);
        value.push(key);
        return await redis.set('sKeys', JSON.stringify(value));
    }

    return await redis.set('sKeys', JSON.stringify([key]));
};

export const getContinuosScores = async () => {
    redis = Container.get('RedisClient');

    while (true) {
        try {
            const cricketGames = getInPlayCricketsApi();
            const response: Response = await fetch(cricketGames);
            const games = await getResults(response);
            const gameIds = games.map(game => game.id);
            console.log(`Got games, results count => ${games.length}`);
            const scoreApis: [number, string][] = gameIds.map((id, index) => [index, getIndividualGameStatsApi(id)]);
            for (const [index, scoreApi] of scoreApis) {
                const score: Response = await fetch(scoreApi);
                const gameScore = await getResults(score);
                const key = `${gameIds[index]}_${new Date().getTime()}`;
                await redis.setKeyWithTTL(key, JSON.stringify(gameScore), config.get('betsEngine.defaultExpiryTimeInSeconds'));
                await storeScoreKeys(key);
                console.log(`Got scores, results count => ${gameScore[0].length}`);
            }
            await delay(config.get('betsEngine.delayInScoreFetchInSeconds'));
        } catch (err) {
            console.log(err);
        }
    }
};
