import { IExpressRequest, IExpressResponse, app } from '@server/express-app';
import { typeOrmAsync } from '@server/utils/type-orm-async.util';
import { API_URL } from '@server/constants/api-url.constant';
import { IRezkaMovieTranslationDto, RezkaMovieTranslationDto } from '@server/dto/rezka_movie_translation.dto';
import { sqlAsync } from '@server/utils/sql-async.util';
import { sql_and, sql_where } from '@server/utils/sql.util';

export interface IRezkaMovieTranslationResponse extends IRezkaMovieTranslationDto {}

interface IRequest extends IExpressRequest {
    query: {
        rezka_movie_id?: string;
        translation_id?: string;
    };
}

interface IResponse extends IExpressResponse<IRezkaMovieTranslationResponse[], void> {}

app.get(API_URL.api.rezkaMovieTranslation.toString(), async (req: IRequest, res: IResponse) => {
    const [data, error] = await getRezkaMovieTranslationAllAsync(req.query);
    if (error) {
        return res.status(400).send('error' + error);
    }
    return res.send(data);
});

export const getRezkaMovieTranslationAllAsync = async (query: IRequest['query']) => {
    return await sqlAsync<(IRezkaMovieTranslationResponse )[]>(async (client) => {
        const { rows } = await client.query(`SELECT * FROM public.rezka_movie_translation
	   where rezka_movie_translation.rezka_movie_id is not null
	   ${sql_and('rezka_movie_translation.rezka_movie_id', query.rezka_movie_id)}
	   ${sql_and('rezka_movie_translation.translation_id', query.translation_id)}
	   `);
		
		return rows;
	});
};
