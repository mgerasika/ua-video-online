import { IExpressRequest, IExpressResponse, app } from '@server/express-app';
import { API_URL } from '@server/constants/api-url.constant';
import { dbService } from '../db.service';
import { IQueryReturn } from '@server/utils/to-query.util';
import { IRezkaMovieResponse } from '../rezka-movie/get-rezka-movie-list.controller';
import { IImdbResponse } from '../imdb/get-imdb-list.controller';
import { ITranslationResponse } from '../translation/get-translation-list.controller';

export interface IGroupMovieResponse {
    imdb_info: IImdbResponse;
    rezka_movie: IRezkaMovieResponse;
    translation?: ITranslationResponse;
}

interface IRequest extends IExpressRequest {}

interface IResponse extends IExpressResponse<IGroupMovieResponse[], void> {}

app.get(API_URL.api.groupMovie.toString(), async (req: IRequest, res: IResponse) => {
    const [data, error] = await groupSearchMoviesAsync();
    if (error) {
        return res.status(400).send('error' + error);
    }
    return res.send(data);
});

export const groupSearchMoviesAsync = async (): Promise<IQueryReturn<IGroupMovieResponse[]>> => {
    const [allRelations, allRelationsError] = await dbService.rezkaMovieTranslation.getRezkaMovieTranslationAllAsync({});
    if (allRelationsError) {
        return [, allRelationsError];
    }

    const [allTranslation, allTranslationError] = await dbService.translation.getTranslationAllAsync({});
    if (allTranslationError) {
        return [, allTranslationError];
    }
    const [imdbs, imdbsError] = await dbService.imdb.getImdbAllAsync();
    if (imdbsError) {
        return [, imdbsError];
    }
    const [movies, error] = await dbService.rezkaMovie.getRezkaMoviesAllAsync({});
    if (error) {
        return [, error];
    }

    console.log('allMovies', movies?.length);
    console.log('allRelations', allRelations?.length);
    console.log('allTranslation', allTranslation?.length);
    console.log('imdbs', imdbs?.length);
    const data = movies
        ?.filter((movie) => movie)
        .filter((movie) => !!allRelations?.find((relation) => relation.rezka_movie_id === movie.id))
        .map((movie): IGroupMovieResponse | undefined => {
            const imdb = imdbs?.find((i) => i.id === movie.rezka_imdb_id);
            if (!imdb) {
                return undefined;
            }
            const translationRelation = allRelations?.find((tr) => tr.rezka_movie_id === movie.id);

            const data = {
                rezka_movie: movie,
                imdb_info: {
                    ...imdb,
                    jsonObj: JSON.parse(imdb.json),
                },
                translation: allTranslation?.find((translation) => translation.id === translationRelation?.translation_id),
            };
            delete (data.imdb_info as any).json;
            return data;
        })
        .filter((m) => m?.imdb_info && m.translation)
        .sort((a, b) => (Number(b?.imdb_info.imdb_rating) || 0) - (Number(a?.imdb_info.imdb_rating) || 0));
    console.log('result', data?.length);
    return [data as IGroupMovieResponse[]];
};
