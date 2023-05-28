import { IExpressRequest, IExpressResponse, app } from '@server/express-app';
import { typeOrmAsync } from '@server/utils/type-orm-async.util';
import { API_URL } from '@server/constants/api-url.constant';
import { ITranslationResponse } from './get-translation-list.controller';
import { TranslationDto } from '@server/dto/translation.dto';

interface IRequest extends IExpressRequest {
    params: {
        id: string;
    };
}

interface IResponse extends IExpressResponse<ITranslationResponse, void> {}

app.get(API_URL.api.translation.id().toString(), async (req: IRequest, res: IResponse) => {
    const [data, error] = await getTranslationByIdAsync(req.params.id);
    if (error) {
        return res.status(400).send('error' + error);
    }
    return res.send(data);
});

export const getTranslationByIdAsync = async (id: string) => {
    return typeOrmAsync<TranslationDto>(async (client) => {
        const entity = await client.getRepository(TranslationDto).findOne({ where: { id } });
        if (!entity) {
            return [, 'entity not found'];
        }
        return [entity];
    });
};
