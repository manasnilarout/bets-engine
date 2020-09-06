import value from '*.json';
import Container, { Service } from 'typedi';

import { config } from '../config';
import { Logger, LoggerInterface } from '../decorators/Logger';
import { ScoresErrorCodes as ErrorCodes } from '../errors/codes';
import { RedisDB } from '../utils/redis';
import { AppService } from './AppService';

@Service()
export class ScoresService extends AppService {
    protected redisClient: RedisDB;

    constructor(
        @Logger(__filename, config.get('clsNamespace.name')) protected log: LoggerInterface
    ) {
        super();
        this.redisClient = Container.get('RedisClient');
    }

    public async getLiveScores(): Promise<any> {
        try {
            const rawKeys: string = await this.redisClient.get('sKeys');
            const keys: string[] = JSON.parse(rawKeys);
            const values: any[] = await this.redisClient.useRedisMethod('mget', keys);

            const results = values.map((val: any, index: number) => {
                return { [keys[index]]: val ? JSON.parse(val) : val };
            });

            const validResults = results.filter((result, index) => result[keys[index]] !== null);
            const validKeys = [];

            results.forEach((result, index) => {
                if (result[keys[index]] !== null) {
                    validKeys.push(keys[index]);
                }
            });

            await this.redisClient.set('sKeys', JSON.stringify(validKeys));

            return validResults;
        } catch (err) {
            const error = this.classifyError(
                err,
                ErrorCodes.fetchingLiveScoresError.id,
                ErrorCodes.fetchingLiveScoresError.msg
            );
            error.log(this.log);
            throw error;
        }
    }
}
