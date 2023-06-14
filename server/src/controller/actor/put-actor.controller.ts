import { IExpressRequest, IExpressResponse, app } from '@server/express-app';
import { typeOrmAsync } from '@server/utils/type-orm-async.util';
import { API_URL } from '@server/constants/api-url.constant';
import { getActorDetailsAsync } from './get-actor-details.controller';
import { IActorResponse } from './get-actor-list.controller';
import { ActorDto } from '@server/dto/actor.dto';

export interface IPutActorBody extends Omit<IActorResponse, 'id'> {}

interface IRequest extends IExpressRequest {
    body: IPutActorBody;
    params: {
        id: string;
    };
}

interface IResponse extends IExpressResponse<IActorResponse, void> {}

app.put(API_URL.api.actor.id().toString(), async (req: IRequest, res: IResponse) => {
    const [, error] = await putActorAsync(req.params.id, req.body);
    if (error) {
        return res.status(400).send('error' + error);
    }

    const [data] = await getActorDetailsAsync(req.params.id);
    return res.send(data);
});

export const putActorAsync = async (id: string, data: Omit<Partial<ActorDto>, 'id'>) => {
    return typeOrmAsync<ActorDto>(async (client) => {
        const entityToUpdate = await client.getRepository(ActorDto).findOne({ where: { id } });
        if (!entityToUpdate) {
            return [, 'Entity not found'];
        }
        return [await client.getRepository(ActorDto).save({ ...entityToUpdate, ...data })];
    });
};
