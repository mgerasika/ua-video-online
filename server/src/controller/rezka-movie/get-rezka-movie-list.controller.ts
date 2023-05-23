import { IExpressRequest, IExpressResponse, app } from '@server/express-app';
import { typeOrmAsync } from '@server/utils/type-orm-async.util';
import { API_URL } from '@server/constants/api-url.constant';
import { ERezkaVideoType, IRezkaMovieDto, RezkaMovieDto } from '@server/dto/rezka-movie.dto';

export interface IRezkaMovieResponse extends IRezkaMovieDto {}

interface IRequest extends IExpressRequest {
    query: {
        imdb_id?: string;
    };
}

interface IResponse extends IExpressResponse<IRezkaMovieResponse[], void> {}

app.get(API_URL.api.rezkaMovie.toString(), async (req: IRequest, res: IResponse) => {
    const [data, error] = await getRezkaMoviesAllAsync(req.query);
    if (error) {
        return res.status(400).send('error' + error);
    }
    return res.send(data);
});

export const getRezkaMoviesAllAsync = async (query: IRequest['query']) => {
    return typeOrmAsync<RezkaMovieDto[]>(async (client) => {
        const qb = client.getRepository(RezkaMovieDto).createQueryBuilder('rezka_movie').select('*');
        if (query.imdb_id) {
            qb.where('rezka_movie.rezka_imdb_id = :imdb_id', { imdb_id: query.imdb_id });
        }
        return [await qb.getRawMany()];
    });
};
