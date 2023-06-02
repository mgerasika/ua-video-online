import { IExpressRequest, IExpressResponse, app } from '@server/express-app';
import { typeOrmAsync } from '@server/utils/type-orm-async.util';
import { API_URL } from '@server/constants/api-url.constant';
import { sqlAsync } from '@server/utils/sql-async.util';
import { ITranslationDto, TranslationDto } from '@server/dto/translation.dto';
import { IQueryReturn } from '@server/utils/to-query.util';

export interface ITranslationResponse extends ITranslationDto {}

interface IRequest extends IExpressRequest {
    query: {
        imdb_id?: string;
    };
}

interface IResponse extends IExpressResponse<ITranslationResponse[], void> {}

app.get(API_URL.api.translation.toString(), async (req: IRequest, res: IResponse) => {
    const [data, error] = await getTranslationAllAsync(req.query);
    if (error) {
        return res.status(400).send('error' + error);
    }
    return res.send(data);
});

export const getTranslationAllAsync = async (query: IRequest['query']): Promise<IQueryReturn<TranslationDto[]>> => {
    if (query.imdb_id) {
        return await sqlAsync<TranslationDto[]>(async (client) => {
            const { rows } = await client.query(`select distinct on(translation.id) translation.* FROM rezka_movie
	left join rezka_movie_translation on rezka_movie.id = rezka_movie_translation.rezka_movie_id
	left join translation on rezka_movie_translation.translation_id = translation.id
	where rezka_movie.rezka_imdb_id = '${query.imdb_id}' and translation.id != ''`);
            return rows;
        });
    }
    return typeOrmAsync<TranslationDto[]>(async (client) => {
        const qb = client.getRepository(TranslationDto).createQueryBuilder('translation').select('*');
        return [await qb.getRawMany()];
    });
};
