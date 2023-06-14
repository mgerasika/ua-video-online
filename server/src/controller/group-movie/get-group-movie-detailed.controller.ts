import { IExpressRequest, IExpressResponse, app } from '@server/express-app';
import { API_URL } from '@server/constants/api-url.constant';
import { IQueryReturn } from '@server/utils/to-query.util';
import { dbService } from '../db.service';
import { IImdbResponse } from '../imdb/get-imdb-list.controller';
import { IRezkaMovieActorResponse } from '../rezka_movie_actor/get-rezka-movie-actor-list.controller';
import { IRezkaMovieActorDto } from '@server/dto/rezka_movie_actor.dto';


export interface IGroupMovieDetailedResponse {
    imdb_info: IImdbResponse;
	rezka_movie_href: string;
	actors: IRezkaMovieActorDto[] ;
	//actors: IRezkaMovieActorDto[] | undefined; TODO Fix codegenerator
}

interface IRequest extends IExpressRequest {
    params: {
        id: string;
    };
}

interface IResponse extends IExpressResponse<IGroupMovieDetailedResponse, void> {}

app.get(API_URL.api.groupMovie.id().toString(), async (req: IRequest, res: IResponse) => {
    const [data, error] = await groupMovieByIdAsync(req.params.id);
    if (error) {
        res.status(400).send('error' + error);
    }
    return res.send(data);
});

export const groupMovieByIdAsync = async (imdb_id: string): Promise<IQueryReturn<IGroupMovieDetailedResponse>> => {
    const [movies, error] = await dbService.rezkaMovie.getRezkaMoviesAllAsync({ imdb_id: imdb_id });
    if (error) {
        return [, error];
    }
   
    if (movies?.length) {
        const [imdb, imdbError] = await dbService.imdb.getImdbByIdAsync(imdb_id);
        if (imdbError || !imdb) {
            return [, imdbError || 'empty imdb'];
        }

		const [actors] = await dbService.rezkaMovieActor.getRezkaMovieActorAllAsync({rezka_movie_id:movies[0].id})
        const data: IGroupMovieDetailedResponse = {
			rezka_movie_href: movies[0].href || '',
			actors: actors || [],
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
