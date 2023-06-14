import { IExpressRequest, IExpressResponse, app } from '@server/express-app';
import { typeOrmAsync } from '@server/utils/type-orm-async.util';
import { API_URL } from '@server/constants/api-url.constant';
import { ActorDto, IActorDto } from '@server/dto/actor.dto';
import { sqlAsync } from '@server/utils/sql-async.util';
import { sql_and, sql_where } from '@server/utils/sql.util';

export interface IActorResponse extends IActorDto {}

interface IRequest extends IExpressRequest {
    query: {
		actor_name?: string;
		movie_id?: string;
		imdb_id?: string;
    };
}

interface IResponse extends IExpressResponse<IActorResponse[], void> {}

app.get(API_URL.api.actor.toString(), async (req: IRequest, res: IResponse) => {
    const [data, error] = await getActorListAllAsync(req.query);
    if (error) {
        return res.status(400).send('error' + error);
    }
    return res.send(data);
});

export const getActorListAllAsync = async (query: IRequest['query']) => {
    return await sqlAsync<IActorResponse[]>(async (client) => {
        const { rows } = await client.query(`select * from(select distinct on(actor.id)actor.id ,actor.* FROM actor
			left join rezka_movie_actor on actor.id = rezka_movie_actor.actor_id 
			left join rezka_movie on rezka_movie.id = rezka_movie_actor.rezka_movie_id 
			inner join rezka_movie_translation on rezka_movie_translation.rezka_movie_id = rezka_movie.id  
			left join imdb on imdb.id = rezka_movie.rezka_imdb_id 
			where rezka_movie_translation.translation_id is not null and rezka_movie_translation.translation_id != ''
			${sql_and('actor.name', query.actor_name)} 
			${sql_and('rezka_movie_actor.rezka_movie_id', query.movie_id)} 
			${sql_and('imdb.id', query.imdb_id)} 
			)t order by t.name`);
        return rows;
    });
};
