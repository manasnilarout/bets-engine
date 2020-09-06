import { getContinuosScores } from '../scores/scoreCollector';

export const scoreLoader = async () => {
    getContinuosScores();
};
