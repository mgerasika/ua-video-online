import { IExpressRequest, IExpressResponse, app } from '@server/express-app';
import { API_URL } from '@server/constants/api-url.constant';
import { IQueryReturn } from '@server/utils/to-query.util';
import { dbService } from '../db.service';
import { IImdbResponse } from '../imdb/get-imdb-list.controller';


export interface IGroupMovieDetailedResponse {
    imdb_info: IImdbResponse;
    rezka_movie_href: string;
}

interface IRequest extends IExpressRequest {
    params: {
        id: string;
    };
}

interface IResponse extends IExpressResponse<IGroupMovieDetailedResponse, void> {}

app.get(API_URL.api.groupMovie.id().toString(), async (req: IRequest, res: IResponse) => {
    const [data, error] = await groupSearchMovieByIdAsync(req.params.id);
    if (error) {
        res.status(400).send('error' + error);
    }
    return res.send(data);
});

export const groupSearchMovieByIdAsync = async (imdb_id: string): Promise<IQueryReturn<IGroupMovieDetailedResponse>> => {
    const [movies, error] = await dbService.rezkaMovie.getRezkaMoviesAllAsync({ imdb_id: imdb_id });
    if (error) {
        return [, error];
    }
   
    if (movies?.length) {
        const [imdb, imdbError] = await dbService.imdb.getImdbByIdAsync(imdb_id);
        if (imdbError || !imdb) {
            return [, imdbError || 'empty imdb'];
        }

        const data: IGroupMovieDetailedResponse = {
            rezka_movie_href: movies[0].href || '',
            imdb_info: {
                ...imdb,
                jsonObj: JSON.parse(imdb.json),
            },
        };
        delete (data.imdb_info as any).json;

        return [data];
    }
    return [, 'not implemented'];
};
