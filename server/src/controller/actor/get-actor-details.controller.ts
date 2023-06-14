import { IExpressRequest, IExpressResponse, app } from '@server/express-app';
import { typeOrmAsync } from '@server/utils/type-orm-async.util';
import { API_URL } from '@server/constants/api-url.constant';
import { IActorResponse } from './get-actor-list.controller';
import { ActorDto } from '@server/dto/actor.dto';


interface IRequest extends IExpressRequest {
    params: {
        id: string;
    };
}

interface IResponse extends IExpressResponse<IActorResponse, void> {}

app.get(API_URL.api.actor.id().toString(), async (req: IRequest, res: IResponse) => {
    const [data, error] = await getActorDetailsAsync(req.params.id);
    if (error) {
        return res.status(400).send('error' + error);
    }
    return res.send(data);
});

export const getActorDetailsAsync = async (id: string) => {
    return typeOrmAsync<ActorDto>(async (client) => {
        const entity = await client.getRepository(ActorDto).findOne({ where: { id } });
        if (!entity) {
            return [, 'entity not found'];
        }
        return [entity];
    });
};
