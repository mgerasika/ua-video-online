import { IExpressRequest, IExpressResponse, app } from '@server/express-app';
import { typeOrmAsync } from '@server/utils/type-orm-async.util';
import { API_URL } from '@server/constants/api-url.constant';
import { IActorResponse, getActorListAllAsync } from './get-actor-list.controller';
import { ActorDto } from '@server/dto/actor.dto';

interface IRequest extends IExpressRequest {
    params: {
        id: string;
    };
}

interface IResponse extends IExpressResponse<IActorResponse[], void> {}

app.delete(API_URL.api.actor.id().toString(), async (req: IRequest, res: IResponse) => {
    const [, error] = await deleteActorAsync(req.params.id);
    if (error) {
        return res.status(400).send('error' + error);
    }
    const [data] = await getActorListAllAsync({});
    return res.send(data);
});

export const deleteActorAsync = async (id: string) => {
    return typeOrmAsync<ActorDto>(async (client) => {
        const entityToDelete = await client.getRepository(ActorDto).findOne({ where: { id } });
        if (!entityToDelete) {
            return [undefined, 'entity not found'];
        }
        return [await client.getRepository(ActorDto).remove(entityToDelete)];
    });
};
