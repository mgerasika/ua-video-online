import { IExpressRequest, IExpressResponse, app } from '@server/express-app';
import { API_URL } from '@server/constants/api-url.constant';
import { dbService } from '../db.service';
import { IQueryReturn } from '@server/utils/to-query.util';
import { IRezkaMovieResponse } from '../rezka-movie/get-rezka-movie-list.controller';
import { IImdbResponse } from '../imdb/get-imdb-list.controller';
import { ITranslationResponse } from '../translation/get-translation-list.controller';
import { ERezkaVideoType } from '@server/dto/rezka-movie.dto';

export interface IGroupMovieResponse {
    rate: number;
    year: number;
    genre: string;
    name: string;
    ua_name: string;
    imdb_id: string;
    has_ua?: boolean;
    has_en?: boolean;
    poster: string;
    video_type: ERezkaVideoType;
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
            const relations = allRelations?.filter((tr) => tr.rezka_movie_id === movie.id);

            const translations = allTranslation?.filter((translation) =>
                relations?.some((s) => s.translation_id === translation.id),
            );
            const imdbJson = JSON.parse(imdb.json);
            return {
                genre: imdbJson.Genre,
                imdb_id: imdb.id,
                rate: +imdb.imdb_rating,
                name: imdb.en_name,
                ua_name: imdb.ua_name || '',
                year: +imdb.year,
                has_en: translations?.some((t) => t.label.toLowerCase().includes('ориг')),
                has_ua: translations?.some((t) => t.label.toLowerCase().includes('укр')),
                poster: imdb.poster,
                video_type: movie.video_type,
            };
        })
        .filter((m) => m?.imdb_id && (m.has_ua || m?.has_en))
        .sort((a, b) => (Number(b?.rate) || 0) - (Number(a?.rate) || 0));
    console.log('result', data?.length);
    return [data as IGroupMovieResponse[]];
};
