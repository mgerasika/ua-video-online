import { IExpressRequest, IExpressResponse, app } from '@server/express-app';
import { typeOrmAsync } from '@server/utils/type-orm-async.util';
import { API_URL } from '@server/constants/api-url.constant';
import { IRezkaMovieTranslationDto, RezkaMovieTranslationDto } from '@server/dto/rezka_movie_translation.dto';

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
    return typeOrmAsync<RezkaMovieTranslationDto[]>(async (client) => {
        const qb = client.getRepository(RezkaMovieTranslationDto).createQueryBuilder('rezka_movie_translation').select('*');
        if (query.rezka_movie_id) {
            qb.where('rezka_movie_translation.rezka_movie_id = :rezka_movie_id', { rezka_movie_id: query.rezka_movie_id });
        }
        if (query.translation_id) {
            qb.where('rezka_movie_translation.translation_id = :translation_id', { translation_id: query.translation_id });
		}
        return [await qb.getRawMany()];
    });
};
