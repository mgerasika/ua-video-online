import { IExpressRequest, IExpressResponse, app } from '@server/express-app';
import { typeOrmAsync } from '@server/utils/type-orm-async.util';
import { API_URL } from '@server/constants/api-url.constant';
import { getTranslationByIdAsync } from './get-translation.controller';
import { ITranslationResponse } from './get-translation-list.controller';
import { TranslationDto } from '@server/dto/translation.dto';

export interface IPutTranslationBody extends Omit<ITranslationResponse, 'id'> {}

interface IRequest extends IExpressRequest {
    body: IPutTranslationBody;
    params: {
        id: string;
    };
}

interface IResponse extends IExpressResponse<ITranslationResponse, void> {}

app.put(API_URL.api.translation.id().toString(), async (req: IRequest, res: IResponse) => {
    const [, error] = await putTranslationAsync(req.params.id, req.body);
    if (error) {
        return res.status(400).send('error' + error);
    }

    const [data] = await getTranslationByIdAsync(req.params.id);
    return res.send(data);
});

export const putTranslationAsync = async (id: string, data: Omit<Partial<TranslationDto>, 'id'>) => {
    return typeOrmAsync<TranslationDto>(async (client) => {
        const entityToUpdate = await client.getRepository(TranslationDto).findOne({ where: { id } });
        if (!entityToUpdate) {
            return [, 'Entity not found'];
        }
        return [await client.getRepository(TranslationDto).save({ ...entityToUpdate, ...data })];
    });
};
