import { IExpressRequest, IExpressResponse, app } from '@server/express-app';
import { typeOrmAsync } from '@server/utils/type-orm-async.util';
import { API_URL } from '@server/constants/api-url.constant';
import { IActorResponse, getActorListAllAsync } from './get-actor-list.controller';
import { ActorDto } from '@server/dto/actor.dto';


export interface IPostActorBody extends Omit<IActorResponse, 'id'> {}

interface IRequest extends IExpressRequest {
    body: IPostActorBody;
}

interface IResponse extends IExpressResponse<IActorResponse[], void> {}

app.post(API_URL.api.actor.toString(), async (req: IRequest, res: IResponse) => {
    const [, error] = await postActorAsync(req.body);
    if (error) {
        return res.status(400).send('error' + error);
    }
    const [data] = await getActorListAllAsync({});
    return res.send(data);
});

export const postActorAsync = async (data: Omit<ActorDto, 'id' | 'get_imdb_id'>) => {
    return typeOrmAsync<ActorDto>(async (client) => {
        return [await client.getRepository(ActorDto).save(data)];
    });
};
