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
import { IResolutionItem } from '../parser/cypress-rezka-streams.controller';
import { CONST } from '@server/constants/const.contant';
import { data } from 'cypress/types/jquery';
import { ITranslationDto } from '@server/dto/translation.dto';

export interface ISetupBody {
    searchImdb: boolean;
    updateRezkaCartoon: boolean;
    updateRezkaFilm: boolean;
    updateRezkaImdbId: boolean;
    updateRezkaTranslations: boolean;
}

interface IRequest extends IExpressRequest {
    body: ISetupBody;
}

interface IResponse extends IExpressResponse<string[], void> {}

const schema = Joi.object<ISetupBody>({
    searchImdb: Joi.boolean().required(),

    updateRezkaCartoon: Joi.boolean().required(),
    updateRezkaFilm: Joi.boolean().required(),
    updateRezkaImdbId: Joi.boolean().required(),
    updateRezkaTranslations: Joi.boolean().required(),
    // rezkaType: Joi.string()
    //     .valid(...Object.values(ERezkaVideoType))
    //     .required(),
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

    if (props.updateRezkaCartoon) {
        const [parseItems = [], parserError] = await dbService.parser.parseRezkaAllPagesAsync({
            type: ERezkaVideoType.cartoon,
        });
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
                    video_type: ERezkaVideoType.cartoon,
                    rezka_imdb_id: null as unknown as string,
                });
                if (postError) {
                    return logs.push(`post rezka movie error ${parseItem.url_id} error=${postError}`);
                }
                logs.push(`post rezka movie success ${parseItem.url_id} `);
            }
        });
    }
    if (props.updateRezkaFilm) {
        const [parseItems = [], parserError] = await dbService.parser.parseRezkaAllPagesAsync({
            type: ERezkaVideoType.film,
        });
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
                    video_type: ERezkaVideoType.film,
                    rezka_imdb_id: null as unknown as string,
                });
                if (postError) {
                    return logs.push(`post rezka movie error ${parseItem.url_id} error=${postError}`);
                }
                logs.push(`post rezka movie success ${parseItem.url_id} `);
            }
        });
    }

    if (props.updateRezkaImdbId) {
        const items = dbMovies.filter((f) => !f.rezka_imdb_id);
        logs.push('download imdb ids  for ' + items.length);
        await oneByOneAsync(
            items.sort((a, b) => b.year - a.year),
            async (dbMovie) => {
                logs.push('parse dbMovie.href', dbMovie.href);
                const [parseItem, parserError] = await dbService.parser.getCypressImdbAsync(dbMovie.href);
                if (parserError) {
                    logs.push(`parse cypress rezka by href error`, parserError);
                    await dbService.rezkaMovie.putRezkaMovieAsync(dbMovie.id, {
                        rezka_imdb_id: CONST.EMPTY_IMDB_ID,
                    });
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

    if (props.updateRezkaTranslations) {
        const [dbMovies = []] = await dbService.rezkaMovie.getRezkaMoviesAllAsync({});
        logs.push('download streams for ' + dbMovies.length);
        // imdb id
        await oneByOneAsync(
            dbMovies.filter((f) => f.rezka_imdb_id).sort((a, b) => b.year - a.year),
            async (dbMovie) => {
                logs.push('imdbId', dbMovie.rezka_imdb_id);
                const [allDbTranslations] = await dbService.rezkaMovieTranslation.getRezkaMovieTranslationAllAsync({
                    rezka_movie_id: dbMovie.id,
                });
                if (allDbTranslations?.length) {
                    logs.push('Skip, found translation');
                    return;
                }
                const [parseItem, parserError] = await dbService.parser.getCypressRezkaStreamsAsync(dbMovie.href);
                if (parserError) {
                    logs.push(`parse cypress rezka by href error`, parserError);
                    return;
                } else if (parseItem) {
                    const uaTranslations = parseItem.translations.filter(
                        (translation) => translation.translation.includes('Укр') || translation.translation.includes('Ориг'),
                    );
                    logs.push(`parse cypress success translations = `, uaTranslations.length);
                    await oneByOneAsync(
                        uaTranslations,
                        async (translation) => {
                            const [dbTranslation, dbTranslationError] = await dbService.translation.getTranslationByIdAsync(
                                translation.data_translator_id.toString(),
                            );
                            logs.push('dbTranslation', dbTranslation);

                            let newTranslation: ITranslationDto | undefined = dbTranslation;
                            if (dbTranslationError) {
                                logs.push('dbTranslationError ' + translation.data_translator_id, dbTranslationError);
                                const [postTranslation, postTranslationError] =
                                    await dbService.translation.postTranslationAsync({
                                        data_ads: translation.data_ads,
                                        data_camrip: translation.data_camrip,
                                        data_director: translation.data_director,
                                        id: translation.data_translator_id,
                                        label: translation.translation,
                                    });
                                if (postTranslationError) {
                                    logs.push('post translation error', postTranslationError);
                                } else if (postTranslation) {
                                    logs.push('post translation success');
                                    newTranslation = postTranslation;
                                }
                            }

                            if (newTranslation) {
                                //TODO find relation if need
                                const [, postRelationError] =
                                    await dbService.rezkaMovieTranslation.postRezkaMovieTranslationAsync({
                                        rezka_movie_id: dbMovie.id,
                                        translation_id: newTranslation?.id || '',
                                    });

                                if (postRelationError) {
                                    logs.push('post relation error', postRelationError);
                                } else {
                                    logs.push('post relation success');
                                }
                            } else {
                                logs.push('error, problem with post relation');
                            }
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
