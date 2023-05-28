import { IExpressRequest, IExpressResponse, app } from '@server/express-app';
import { typeOrmAsync } from '@server/utils/type-orm-async.util';
import { API_URL } from '@server/constants/api-url.constant';
import { ITranslationResponse, getTranslationAllAsync } from './get-translation-list.controller';
import { TranslationDto } from '@server/dto/translation.dto';

interface IRequest extends IExpressRequest {
    params: {
        id: string;
    };
}

interface IResponse extends IExpressResponse<ITranslationResponse[], void> {}

app.delete(API_URL.api.translation.id().toString(), async (req: IRequest, res: IResponse) => {
    const [, error] = await deleteTranslationAsync(req.params.id);
    if (error) {
        return res.status(400).send('error' + error);
    }
    const [data] = await getTranslationAllAsync({});
    return res.send(data);
});

export const deleteTranslationAsync = async (id: string) => {
    return typeOrmAsync<TranslationDto>(async (client) => {
        const entityToDelete = await client.getRepository(TranslationDto).findOne({ where: { id } });
        if (!entityToDelete) {
            return [undefined, 'entity not found'];
        }
        return [await client.getRepository(TranslationDto).remove(entityToDelete)];
    });
};
