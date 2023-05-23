import { IExpressRequest, IExpressResponse, app } from '@server/express-app';
import { API_URL } from '@server/constants/api-url.constant';
import { dbService } from '../db.service';
import { IQueryReturn } from '@server/utils/to-query.util';
import { IRezkaMovieResponse } from '../rezka-movie/get-rezka-movie-list.controller';
import { IImdbResponse } from '../imdb/get-imdb-list.controller';

export interface IGroupMovieResponse {
    imdb_info: IImdbResponse;
    rezka_movie: IRezkaMovieResponse;
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
    const [imdbs, imdbsError] = await dbService.imdb.getImdbAllAsync();
    if (imdbsError) {
        return [, imdbsError];
    }
    const [movies, error] = await dbService.rezkaMovie.getRezkaMoviesAllAsync({});
    if (error) {
        return [, error];
    }
    const data = movies
        ?.filter((m) => m)
        .map((movie): IGroupMovieResponse | undefined => {
            const imdb = imdbs?.find((i) => i.id === movie.rezka_imdb_id);
            if (!imdb) {
                return undefined;
            }
            return {
                rezka_movie: movie,
                imdb_info: imdb as IImdbResponse,
            };
        })
        .filter((m) => m?.imdb_info)
        .sort((a, b) => (b?.imdb_info.imdb_rating || 0) - (a?.imdb_info.imdb_rating || 0))
        .slice(0, 5);

    return [data as IGroupMovieResponse[]];
};
