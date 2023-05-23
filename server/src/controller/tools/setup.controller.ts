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
import { ERezkaVideoType, RezkaMovieDto } from '@server/dto/rezka-movie.dto';
import { EResolution } from '@server/enum/resolution.enum';
import { ETranslation } from '@server/enum/translation.enum';
import { ImdbDto } from '@server/dto/imdb.dto';
import { IResolutionItem } from '../cypress/cypress-rezka-streams.controller';

export interface ISetupBody {
    searchImdb: boolean;
    updateRezka: boolean;
    updateRezkaById: boolean;
    updateRezkaImdbId: boolean;
    updateRezkaStreams: boolean;
    rezkaType: ERezkaVideoType;
}

interface IRequest extends IExpressRequest {
    body: ISetupBody;
}

interface IResponse extends IExpressResponse<string[], void> {}

const schema = Joi.object<ISetupBody>({
    searchImdb: Joi.boolean().required(),

    updateRezka: Joi.boolean().required(),
    updateRezkaById: Joi.boolean().required(),
    updateRezkaImdbId: Joi.boolean().required(),
    updateRezkaStreams: Joi.boolean().required(),
    rezkaType: Joi.string()
        .valid(...Object.values(ERezkaVideoType))
        .required(),
});

app.post(API_URL.api.tools.setup.toString(), async (req: IRequest, res: IResponse) => {
    (req as any).setTimeout(60 * 60 * 60 * 10000);
    (req as any).connection.on('close', function () {
        console.log('cancel request');
    });

    const [, validateError] = validateSchema(schema, req.body);
    if (validateError) {
        return res.status(400).send(validateError);
    }

    const [logs, setupError] = await setupAsync(req.body);
    if (setupError) {
        return res.status(400).send(setupError);
    }
    return res.send(logs);
});

export const setupAsync = async (props: ISetupBody): Promise<IQueryReturn<string[]>> => {
    const logs = createLogs();

    const [dbMovies = []] = await dbService.rezkaMovie.getRezkaMoviesAllAsync({});

    if (props.searchImdb) {
        const [imdbInfoItems = []] = await dbService.imdb.getImdbAllAsync();

        await oneByOneAsync(dbMovies, async (movieItem) => {
            const imdbInfo = imdbInfoItems.find(
                (imdbItem) =>
                    imdbItem.en_name === movieItem.en_name ||
                    imdbItem.id === movieItem.rezka_imdb_id ||
                    imdbItem.id === movieItem.imdb_id,
            );
            if (imdbInfo) {
                return;
            }
            const [newImdbInfo, newImdbInfoError] = await dbService.imdb.searchImdbMovieInfoAsync(
                movieItem.en_name,
                movieItem.year + '',
                movieItem.rezka_imdb_id,
            );
            if (newImdbInfoError) {
                return logs.push(`imdb info not found ${movieItem.en_name} error=${newImdbInfoError}`);
            }

            if (newImdbInfo) {
                const [, postImdbError] = await postImdbAsync({
                    en_name: newImdbInfo.Title,
                    imdb_rating: +newImdbInfo.imdbRating,
                    json: JSON.stringify(newImdbInfo),
                    poster: newImdbInfo.Poster,
                    year: +newImdbInfo.Year,
                    id: newImdbInfo.imdbID,
                });
                if (postImdbError) {
                    return logs.push(`imdb post error ${movieItem.en_name} imdbId = ${newImdbInfo.imdbID}`);
                }
                logs.push(`imdb post success ${movieItem.en_name} imdbId = ${newImdbInfo.imdbID}`);
            }
        });
    }

    if (props.updateRezka) {
        const [parseItems = [], parserError] = await dbService.parser.parseRezkaAllPagesAsync({ type: props.rezkaType });
        if (parserError) {
            logs.push(`rezka items has some error`, parserError);
        }
        logs.push(`rezka items return success count=${parseItems?.length}`);

        await oneByOneAsync(parseItems, async (parseItem) => {
            const dbMovie = dbMovies?.find((movie) => movie.href === parseItem.href);
            if (!dbMovie) {
                const [, postError] = await dbService.rezkaMovie.postRezkaMovieAsync({
                    href: parseItem.href,
                    url_id: parseItem.url_id,
                    en_name: '',
                    year: parseItem.year,
                    video_type: props.rezkaType,
                    rezka_imdb_id: null as unknown as string,
                });
                if (postError) {
                    return logs.push(`post rezka movie error ${parseItem.url_id} error=${postError}`);
                }
                logs.push(`post rezka movie success ${parseItem.url_id} `);
            }
        });
    }

    if (props.updateRezkaById) {
        const [rezkaDbMovies = []] = await dbService.rezkaMovie.getRezkaMoviesAllAsync({});

        await oneByOneAsync(
            rezkaDbMovies.filter((f) => !f.en_name),
            async (dbMovie) => {
                const [parseItem, parserError] = await dbService.parser.parseRezkaDetailsAsync(dbMovie.href);
                if (parserError) {
                    logs.push(`rezka by id error`, parserError);
                    return;
                } else if (parseItem) {
                    const [, postError] = await dbService.rezkaMovie.putRezkaMovieAsync(dbMovie.id, {
                        en_name: parseItem.en_name,
                    });
                    if (postError) {
                        return logs.push(`post rezka movie error ${dbMovie.id} error=${postError}`);
                    }
                    logs.push(`post rezka movie success ${dbMovie.id} `);
                }
            },
            { timeout: 5000 },
        );
    }

    if (props.updateRezkaImdbId) {
        const items = dbMovies.filter((f) => !f.rezka_imdb_id).reverse();
        logs.push('download imdb ids  for ' + items.length);
        await oneByOneAsync(
            items,
            async (dbMovie) => {
                const [parseItem, parserError] = await dbService.cypress.getCypressImdbAsync(dbMovie.href);
                if (parserError) {
                    logs.push(`parse cypress rezka by href error`, parserError);
                    return;
                } else if (parseItem) {
                    const [, postError] = await dbService.rezkaMovie.putRezkaMovieAsync(dbMovie.id, {
                        rezka_imdb_id: parseItem.id,
                    });
                    if (postError) {
                        return logs.push(`post rezka movie error ${dbMovie.id} error=${postError}`);
                    }
                    logs.push(`post rezka movie imdbId success ${dbMovie.id} `);
                }
            },
            { timeout: 0 },
        );
    }

    if (props.updateRezkaStreams) {
        const [hrefObjects = []] = await dbService.rezkaMovie.searchHrefRezkaMoviesAsync();
        logs.push('download streams for ' + hrefObjects.length);
        // imdb id
        await oneByOneAsync(
            hrefObjects.filter((f) => f.href === 'https://rezka.ag/cartoons/fantasy/25701-tayna-koko-2017.html'),
            async (hrefObj) => {
                const [parseItem, parserError] = await dbService.cypress.getCypressRezkaStreamsAsync(hrefObj.href);
                if (parserError) {
                    logs.push(`parse cypress rezka by href error`, parserError);
                    return;
                } else if (parseItem) {
                    await oneByOneAsync(
                        parseItem.translations,
                        async (translation) => {
                            await oneByOneAsync(
                                [
                                    translation.resolutions
                                        .filter(
                                            (resolution) =>
                                                resolution.resolution.includes('1080') ||
                                                resolution.resolution.includes('1280p'),
                                        )
                                        .pop(),
                                ].filter((f) => f) as IResolutionItem[],
                                async (resolution: IResolutionItem) => {
                                    await oneByOneAsync(
                                        [resolution.streams.shift()].filter((f) => f),
                                        async (stream) => {
                                            const [postStream, postStreamError] = await dbService.stream.postStreamAsync({
                                                stream_url: stream || '',
                                                translation_original_text: translation.translation,
                                                imdb: new ImdbDto(hrefObj.rezka_imdb_id),
                                                resolution_enum: ('_' + resolution.resolution) as EResolution,
                                                translation_enum: null as unknown as ETranslation,
                                            });
                                            if (postStreamError) {
                                                logs.push(`post stream error`, postStreamError);
                                                return;
                                            } else if (postStream) {
                                                logs.push(`post stream success`, postStream);
                                            }
                                        },
                                        { timeout: 0 },
                                    );
                                },
                                { timeout: 0 },
                            );
                        },
                        { timeout: 0 },
                    );
                }
            },
            { timeout: 0 },
        );
    }

    return [logs.get(), undefined];
};
