import { IExpressRequest, IExpressResponse, app } from '@server/express-app';
import { API_URL } from '@server/constants/api-url.constant';
import { IImdbResponse, getImdbAllAsync } from '../imdb/get-imdb-list.controller';
import { postImdbAsync } from '../imdb/post-imdb.controller';
import { dbService } from '../db.service';
import Joi from 'joi';
import { validateSchema } from '@server/utils/validate-schema.util';
import { createLogs } from '@server/utils/create-logs.utils';
import { oneByOneAsync } from '@server/utils/one-by-one-async.util';
import { IQueryReturn } from '@server/utils/to-query.util';
import { ECartoonSubCategory, EFilmSubCategory, ERezkaVideoType, RezkaMovieDto } from '@server/dto/rezka-movie.dto';
import { EResolution } from '@server/enum/resolution.enum';
import { ETranslation } from '@server/enum/translation.enum';
import { ImdbDto } from '@server/dto/imdb.dto';
import { IResolutionItem } from '../parser/cypress-rezka-streams.controller';
import { CONST } from '@server/constants/const.contant';
import { data } from 'cypress/types/jquery';
import { ITranslationDto } from '@server/dto/translation.dto';
import { IImdbResultResponse } from '../imdb/search-imdb.controller';
import { ENV } from '@server/env';
import { prop } from 'cheerio/lib/api/attributes';
import { IRezkaInfoResponse } from '../parser/rezka-all.controller';
import { IRabbitMqMessage } from '@server/interfaces/rabbit-mq-message.interface';

export interface ISetupRabbitMqBody {
    updateRezkaTranslations?: boolean;
    updateRezkaImdbId?: boolean;
}

interface IRequest extends IExpressRequest {
    body: ISetupRabbitMqBody;
}

interface IResponse extends IExpressResponse<string[], void> {}

const schema = Joi.object<ISetupRabbitMqBody>({
    updateRezkaTranslations: Joi.boolean().required(),
    updateRezkaImdbId: Joi.boolean().required(),
});

app.post(API_URL.api.tools.setupRabbitMq.toString(), async (req: IRequest, res: IResponse) => {
    (req as any).setTimeout(30 * 24 * 60 * 60 * 1000);
    (req as any).connection.on('close', function () {
        console.log('cancel request');
    });

    const [, validateError] = validateSchema(schema, req.body);
    if (validateError) {
        return res.status(400).send(validateError);
    }

    const [logs, setupError] = await setupRabbitMqAsync(req.body);
    if (setupError) {
        return res.status(400).send(setupError);
    }
    return res.send(logs);
});

export const setupRabbitMqAsync = async (props: ISetupRabbitMqBody): Promise<IQueryReturn<string[]>> => {
    const logs = createLogs();

    const [dbMovies = []] = await dbService.rezkaMovie.getRezkaMoviesAllAsync({});

    if (props.updateRezkaImdbId) {
        const items = dbMovies.filter((f) => !f.rezka_imdb_id);
        logs.push('download imdb ids for ' + items.length);
        await oneByOneAsync(
            shuffleArray(items),
            async (dbMovie) => {
                const message: IRabbitMqMessage = {
                    setupBody: { updateRezkaImdbIdProps: { rezkaId: dbMovie.id } },
                };
                await dbService.rabbitMQ.sendMessageAsync(message);
                logs.push('start rabbit mq for ' + JSON.stringify(message));
            },
            { timeout: 0 },
        );
    }

    if (props.updateRezkaTranslations) {
        const [dbMovies = []] = await dbService.rezkaMovie.getRezkaMoviesAllAsync({});

        const [allTranslations] = await dbService.rezkaMovieTranslation.getRezkaMovieTranslationAllAsync({});
        console.log('allTranslations count = ', allTranslations?.length);
        const filtered = dbMovies.filter(
            (dbMovie) =>
                dbMovie.rezka_imdb_id &&
                dbMovie.rezka_imdb_id !== 'tt000000' &&
                !allTranslations?.some((tr) => tr.rezka_movie_id === dbMovie.id),
        );
        logs.push('download streams for ' + filtered.length);
        await oneByOneAsync(shuffleArray(filtered), async (dbMovie) => {
            const message: IRabbitMqMessage = { setupBody: { updateRezkaTranslationByIdProps: { rezkaId: dbMovie.id } } };
            await dbService.rabbitMQ.sendMessageAsync(message);
            logs.push('start rabbit mq for ' + JSON.stringify(message));
        });
    }

    return [logs.get(), undefined];
};

function shuffleArray<T>(array: T[]): T[] {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}
