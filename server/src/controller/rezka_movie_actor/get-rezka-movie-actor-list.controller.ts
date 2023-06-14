import { IExpressRequest, IExpressResponse, app } from '@server/express-app';
import { typeOrmAsync } from '@server/utils/type-orm-async.util';
import { API_URL } from '@server/constants/api-url.constant';
import { IRezkaMovieActorDto, RezkaMovieActorDto } from '@server/dto/rezka_movie_actor.dto';
import { sqlAsync } from '@server/utils/sql-async.util';
import { sql_where } from '@server/utils/sql.util';
import { IQueryReturn } from '@server/utils/to-query.util';

export interface IRezkaMovieActorResponse extends IRezkaMovieActorDto {
	name: string;
}

interface IRequest extends IExpressRequest {
    query: {
        rezka_movie_id?: string;
    };
}

interface IResponse extends IExpressResponse<IRezkaMovieActorResponse[], void> {}

export const getRezkaMovieActorAllAsync = async (query: IRequest['query']): Promise<IQueryReturn<IRezkaMovieActorResponse[]>>  => {
    return await sqlAsync<(IRezkaMovieActorDto & {name:string})[]>(async (client) => {
        const { rows } = await client.query(`SELECT rezka_movie_actor.*, actor.name FROM public.rezka_movie_actor
	   inner join actor on actor.id = rezka_movie_actor.actor_id
	   ${sql_where('rezka_movie_actor.rezka_movie_id', query.rezka_movie_id)}`);
		return rows;
	});
	
};
