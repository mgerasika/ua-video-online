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
import { IImdbResultResponse } from '../imdb/search-imdb.controller';

export interface ISetupBody {
    searchImdb: boolean;
    updateImdbUaName: boolean;
    updateRezkaCartoon: boolean;
    updateRezkaFilm: boolean;
    updateRezkaImdbId: boolean;
    updateRezkaTranslations: boolean;
    addActorsFromMovieDb: boolean;
    uploadActorPhotoToCdn: boolean;
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
    updateImdbUaName: Joi.boolean().required(),
    addActorsFromMovieDb: Joi.boolean().required(),
    uploadActorPhotoToCdn: Joi.boolean().required(),
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

    if (props.uploadActorPhotoToCdn) {
        const [dbActors = []] = await dbService.actor.getActorListAllAsync({});
        await oneByOneAsync(
            dbActors, //.filter((f) => !f.photo_url),
            async (dbActor) => {
                const fileName = `${dbActor.id}.jpg`;
                const [hasFile] = await dbService.cdn.hasFileCDNAsync({ fileName: fileName });
                if (hasFile) {
                    return;
                }

                // const [movies, moviesError] = await dbService.groupMovie.groupMovieListV2Async({ actor_id: dbActor.id });
                // if (moviesError) {
                //     return logs.push('not found any movie with this actor' + dbActor.name);
                // }
                const [searchSuccess, searchError] = await dbService.tools.imageSearchAsync(
                    `${dbActor.name} portrait, actor`,
                );
                if (searchError) {
                    return logs.push(`can not find image for actor`, searchError);
                } else if (searchSuccess?.length) {
                    logs.push('search success ' + searchSuccess[0]);
                }

                if (searchSuccess?.length) {
                    const [successUpload, errorUpload] = await dbService.cdn.uploadFileToCDNAsync({
                        fileName: fileName,
                        fileUrl: searchSuccess[0],
                    });
                    if (errorUpload) {
                        return logs.push(`error upload to cdn`, errorUpload);
                    }
                    logs.push(`success upload to cdn`, successUpload);
                    const [, putActorError] = await dbService.actor.putActorAsync(dbActor.id, {
                        ...dbActor,
                        photo_url: successUpload || '',
                    });
                    if (putActorError) {
                        logs.push('can not put photo_url', putActorError);
                    } else {
                        logs.push('put actor photo success ' + successUpload);
                    }
                }
            },
        );
    }

    if (props.updateRezkaCartoon) {
        const [parseItems = [], parserError] = await dbService.parser.parseRezkaAllPagesAsync({
            type: ERezkaVideoType.cartoon,
        });
        if (parserError) {
            logs.push(`rezka items has some error`, parserError);
        }
        logs.push(`rezka items return success count=${parseItems?.length}`);

        await oneByOneAsync(
            parseItems,
            async (parseItem) => {
                const dbMovie = dbMovies?.find((movie) => movie.href === parseItem.href);
                if (!dbMovie) {
                    const [, postError] = await dbService.rezkaMovie.postRezkaMovieAsync({
                        href: parseItem.href,
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
            },
            { timeout: 0 },
        );
    }
    if (props.updateRezkaFilm) {
        const [parseItems = [], parserError] = await dbService.parser.parseRezkaAllPagesAsync({
            type: ERezkaVideoType.film,
        });
        if (parserError) {
            logs.push(`rezka items has some error`, parserError);
        }
        logs.push(`rezka items return success count=${parseItems?.length}`);

        await oneByOneAsync(
            parseItems,
            async (parseItem) => {
                const dbMovie = dbMovies?.find((movie) => movie.href === parseItem.href);
                if (!dbMovie) {
                    const [, postError] = await dbService.rezkaMovie.postRezkaMovieAsync({
                        href: parseItem.href,
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
            },
            { timeout: 0 },
        );
    }

    if (props.updateRezkaImdbId) {
        const items = dbMovies.filter((f) => !f.rezka_imdb_id);
        logs.push('download imdb ids for ' + items.length);
        await oneByOneAsync(
            items.sort((a, b) => b.year - a.year),
            async (dbMovie) => {
                logs.push('parse dbMovie.href', dbMovie.href);
                const [parseItem, parserError] = await dbService.parser.getCypressImdbAsync(dbMovie.href);
                if (parserError) {
                    logs.push(`parse cypress rezka by href error`);
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

    if (props.searchImdb) {
        const [imdbInfoItems = []] = await dbService.imdb.getImdbAllAsync();
        const filtered = dbMovies
            .filter((movie) => movie.rezka_imdb_id && !movie.rezka_imdb_id.includes(CONST.EMPTY_IMDB_ID))
            .filter((movieItem) => {
                const imdbInfo = imdbInfoItems.find(
                    (imdbItem) => imdbItem.en_name === movieItem.en_name || imdbItem.id === movieItem.rezka_imdb_id,
                );
                if (imdbInfo) {
                    return false;
                }
                return true;
            });
        logs.push('searchImdb without imdbs - ', filtered.length);
        await oneByOneAsync(filtered, async (movieItem) => {
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

    if (props.updateImdbUaName) {
        const [imdbInfoItems = []] = await dbService.imdb.getImdbAllAsync();
        const filtered = imdbInfoItems.filter((imdb) => !imdb.ua_name);

        logs.push('searchImdb without ua name - ', filtered.length);
        await oneByOneAsync(
            filtered,
            async (imdbItem) => {
                const [uaInfo, uaInfoError] = await dbService.imdb.searchUANameMovieInfoAsync(imdbItem.id);
                if (uaInfoError) {
                    return logs.push(`imdb ua info not found ${imdbItem.en_name} error=${uaInfoError}`);
                }

                if (uaInfo) {
                    const [, postImdbError] = await dbService.imdb.putImdbAsync(imdbItem.id, {
                        ua_name: uaInfo.uaName,
                    });
                    if (postImdbError) {
                        return logs.push(`imdb add ua info error ${imdbItem.en_name} imdbId = ${imdbItem.id}`);
                    }
                    logs.push(`imdb add ua name success ${imdbItem.en_name} imdbId = ${imdbItem.id}`);
                }
            },
            { timeout: 500 },
        );
    }

    if (props.addActorsFromMovieDb) {
        const items = dbMovies.filter((f) => f.rezka_imdb_id);
        logs.push('addActorsFromMovieDb ' + items.length);
        await oneByOneAsync(
            shuffleArray(items),
            async (dbMovie, idx) => {
                console.log('idx', idx);
                const [imdbItem, imdbError] = await dbService.imdb.getImdbByIdAsync(dbMovie.rezka_imdb_id);
                if (imdbError) {
                    return logs.push(`imdb not found`);
                } else if (imdbItem) {
                    const json: IImdbResultResponse = JSON.parse(imdbItem.json);
                    const actors = json.Actors.split(',');
                    await oneByOneAsync(actors, async (actor) => {
                        const [, postError] = await dbService.actor.postActorAsync({
                            name: actor.trim(),
                            photo_url: null as unknown as string,
                        });
                        if (postError) {
                            logs.push(`post actor error ${dbMovie.id} error=${postError}`);
                        } else {
                            logs.push('post actor success', actor);
                        }

                        const [actors] = await dbService.actor.getActorListAllAsync({ actor_name: actor.trim() });
                        if (actors?.length) {
                            //todo fix
                            const [, relationError] = await dbService.rezkaMovieActor.postRezkaMovieActorAsync({
                                actor_id: actors[0].id,
                                rezka_movie_id: dbMovie.id,
                                is_actor: true,
                                is_director: false,
                                is_writer: false,
                            });
                            if (relationError) {
                                logs.push('add actor relation error ' + relationError);
                            }
                        }
                    });

                    const writers = json.Writer.split(',');
                    await oneByOneAsync(writers, async (writer) => {
                        const [, postError] = await dbService.actor.postActorAsync({
                            name: writer.trim(),
                            photo_url: null as unknown as string,
                        });
                        if (postError) {
                            logs.push(`post writer error ${dbMovie.id} error=${postError}`);
                        } else {
                            logs.push('post writer success', writer);
                        }

                        const [actors] = await dbService.actor.getActorListAllAsync({ actor_name: writer.trim() });
                        if (actors?.length) {
                            //todo fix
                            const [, relationError] = await dbService.rezkaMovieActor.postRezkaMovieActorAsync({
                                actor_id: actors[0].id,
                                rezka_movie_id: dbMovie.id,
                                is_actor: false,
                                is_director: false,
                                is_writer: true,
                            });
                            if (relationError) {
                                logs.push('add writer relation error ' + relationError);
                            }
                        }
                    });

                    const directors = json.Director.split(',');
                    await oneByOneAsync(directors, async (director) => {
                        const [, postError] = await dbService.actor.postActorAsync({
                            name: director.trim(),
                            photo_url: null as unknown as string,
                        });
                        if (postError) {
                            logs.push(`post director error ${dbMovie.id} error=${postError}`);
                        } else {
                            logs.push('post director success', director);
                        }

                        const [actors] = await dbService.actor.getActorListAllAsync({ actor_name: director.trim() });
                        if (actors?.length) {
                            //todo fix
                            const [, relationError] = await dbService.rezkaMovieActor.postRezkaMovieActorAsync({
                                actor_id: actors[0].id,
                                rezka_movie_id: dbMovie.id,
                                is_actor: false,
                                is_director: true,
                                is_writer: false,
                            });
                            if (relationError) {
                                logs.push('add director relation error ' + relationError);
                            }
                        }
                    });
                }
            },
            { timeout: 0 },
        );
    }

    if (props.updateRezkaTranslations) {
        const [dbMovies = []] = await dbService.rezkaMovie.getRezkaMoviesAllAsync({});

        const [allDbTranslations] = await dbService.rezkaMovieTranslation.getRezkaMovieTranslationAllAsync({});

        const filtered = dbMovies.filter((dbMovie) => dbMovie.rezka_imdb_id);
        // .filter((dbMovie) => !!allDbTranslations?.filter((tr) => tr.rezka_movie_id === dbMovie.id && tr.translation_id));
        logs.push('download streams for ' + filtered.length);
        // imdb id
        await oneByOneAsync(
            shuffleArray(filtered),
            async (dbMovie) => {
                logs.push('imdbId', dbMovie.rezka_imdb_id);

                const [parseItem, parserError] = await dbService.parser.getCypressRezkaStreamsAsync(dbMovie.href);
                if (parserError) {
                    logs.push(`parse cypress rezka stream error`);
                    //add empty translation relation
                    const [, postRelationError] = await dbService.rezkaMovieTranslation.postRezkaMovieTranslationAsync({
                        rezka_movie_id: dbMovie.id,
                        translation_id: '',
                        data_ads: 0,
                        data_camrip: 0,
                        data_director: 0,
                    });

                    if (postRelationError) {
                        logs.push('post empty relation error', postRelationError);
                    } else {
                        logs.push('post empty relation success');
                    }
                    return;
                } else if (parseItem) {
                    const allTranslations = parseItem.translations;

                    logs.push(`parse cypress success translations = `, allTranslations.length);
                    if (allTranslations.length === 0) {
                        //add empty translation relation
                        const [, postRelationError] = await dbService.rezkaMovieTranslation.postRezkaMovieTranslationAsync({
                            rezka_movie_id: dbMovie.id,
                            translation_id: '',
                            data_ads: 0,
                            data_camrip: 0,
                            data_director: 0,
                        });

                        if (postRelationError) {
                            logs.push('post empty relation error', postRelationError);
                        } else {
                            logs.push('post empty relation success');
                        }
                    }
                    await oneByOneAsync(
                        allTranslations,
                        async (translation) => {
                            const [dbTranslation, dbTranslationError] = await dbService.translation.getTranslationByIdAsync(
                                translation.data_translator_id.toString(),
                            );
                            logs.push('dbTranslation', dbTranslation);

                            let currentTranslation: ITranslationDto | undefined = dbTranslation;
                            if (dbTranslationError) {
                                logs.push('dbTranslationError ' + translation.data_translator_id, dbTranslationError);
                                const [postTranslation, postTranslationError] =
                                    await dbService.translation.postTranslationAsync({
                                        id: translation.data_translator_id,
                                        label: translation.translation,
                                    });
                                if (postTranslationError) {
                                    logs.push('post translation error', postTranslationError);
                                } else if (postTranslation) {
                                    logs.push('post translation success');
                                    currentTranslation = postTranslation;
                                }
                            }

                            // add relation
                            if (currentTranslation) {
                                //TODO find relation if need
                                const [, postRelationError] =
                                    await dbService.rezkaMovieTranslation.postRezkaMovieTranslationAsync({
                                        rezka_movie_id: dbMovie.id,
                                        translation_id: currentTranslation?.id || '',
                                        data_ads: +translation.data_ads,
                                        data_camrip: +translation.data_camrip,
                                        data_director: +translation.data_director,
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

function shuffleArray<T>(array: T[]): T[] {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}
