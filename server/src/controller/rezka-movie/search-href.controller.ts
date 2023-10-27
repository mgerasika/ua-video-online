import { IExpressRequest, IExpressResponse, app } from '@server/express-app';
import { sqlAsync } from '@server/utils/sql-async.util';
import { API_URL } from '@server/constants/api-url.constant';
import { IRezkaMovieDto } from '@server/dto/rezka-movie.dto';

export interface ISearchRezkaMovieResponse extends IRezkaMovieDto {

}

interface IRequest extends IExpressRequest {
    query: {
        rezka_imdb_id: string;
    };
}

interface IResponse extends IExpressResponse<ISearchRezkaMovieResponse[], void> {}

app.get(API_URL.api.rezkaMovie.search.toString(), async (req: IRequest, res: IResponse) => {
    const [data, error] = await searchRezkaMovieAsync(req);
    if (error) {
        return res.status(400).send('error ' + error);
    }
    return res.send(data);
});

export const searchRezkaMovieAsync = async (req: IRequest) => {
    return sqlAsync<ISearchRezkaMovieResponse[]>(async (client) => {
		const { rows } =
            await client.query(`select * FROM rezka_movie
	where rezka_movie.rezka_imdb_id = '${req.query.rezka_imdb_id}'
`);
        return rows;
    });
};
//	where rezka_movie.rezka_imdb_id not in (select imdb_id from stream)
