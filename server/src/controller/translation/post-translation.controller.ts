import { IExpressRequest, IExpressResponse, app } from '@server/express-app';
import { typeOrmAsync } from '@server/utils/type-orm-async.util';
import { API_URL } from '@server/constants/api-url.constant';
import { ITranslationResponse, getTranslationAllAsync } from './get-translation-list.controller';
import { TranslationDto } from '@server/dto/translation.dto';
import { IQueryReturn } from '@server/utils/to-query.util';

export interface IPostTranslationBody extends ITranslationResponse {}

interface IRequest extends IExpressRequest {
    body: IPostTranslationBody;
}

interface IResponse extends IExpressResponse<ITranslationResponse[], void> {}

app.post(API_URL.api.translation.toString(), async (req: IRequest, res: IResponse) => {
    const [, error] = await postTranslationAsync(req.body);
    if (error) {
        return res.status(400).send('error' + error);
    }
    const [data] = await getTranslationAllAsync({});
    return res.send(data);
});

export const postTranslationAsync = async (data: TranslationDto): Promise<IQueryReturn<TranslationDto>> => {
    if (!data.id || data.id.length < 3) {
        return [undefined, 'Id can not be empty string or id too short id = ' + data.id];
    }
    return typeOrmAsync<TranslationDto>(async (client) => {
        return [await client.getRepository(TranslationDto).save(data)];
    });
};
