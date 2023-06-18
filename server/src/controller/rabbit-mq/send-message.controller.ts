import { IExpressRequest, IExpressResponse, app } from '@server/express-app';
import { API_URL } from '@server/constants/api-url.constant';
import { IImdbResponse, getImdbAllAsync } from '../imdb/get-imdb-list.controller';
import { postImdbAsync } from '../imdb/post-imdb.controller';
import { dbService } from '../db.service';
import Joi from 'joi';
import { validateSchema } from '@server/utils/validate-schema.util';
import { createLogs } from '@server/utils/create-logs.utils';
import { oneByOneAsync } from '@server/utils/one-by-one-async.util';
import { IQueryReturn } from '@server/utils/to-query.util';
import axios from 'axios';
import { rabbitMQ_sendData } from '@server/rabbit-mq';

interface IRequest extends IExpressRequest {
    body: any;
}

interface IResponse extends IExpressResponse<string[], void> {}

app.post(API_URL.api.rabbitMQ.sendMessage.toString(), async (req: IRequest, res: IResponse) => {
    const [logs, setupError] = await sendMessageAsync(req.body);
    if (setupError) {
        return res.status(400).send(setupError);
    }
    return res.send(logs);
});

export const sendMessageAsync = async (body: string): Promise<IQueryReturn<boolean>> => {
    rabbitMQ_sendData(body);

    return [true, undefined];
};
