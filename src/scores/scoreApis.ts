import { config } from '../config';
import { env } from '../env';

export const getInPlayCricketsApi = (): string => {
    return `https://api.b365api.com/v1/bet365/inplay_filter?sport_id=${config.get('betsEngine.sports.cricket')}&token=${env.betsEngine.token}`;
};

export const getIndividualGameStatsApi = (id: string): string => {
    return `https://api.b365api.com/v1/bet365/event?token=${env.betsEngine.token}&FI=${id}`;
};
