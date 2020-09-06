import { Get, JsonController } from 'routing-controllers';

import { ScoresService } from '../../../services/ScoresService';
import { Scores as Route } from '../../routes/http';

@JsonController(Route.BASE)
export class ScoresController {
    constructor(
        private scoresService: ScoresService
    ) { }

    @Get(Route.LIVE)
    public async getLiveScores(): Promise<any> {
        return await this.scoresService.getLiveScores();
    }
}
