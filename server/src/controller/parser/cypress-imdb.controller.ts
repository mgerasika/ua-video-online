import { IExpressRequest, IExpressResponse, app } from '@server/express-app';
import axios from 'axios';
import { API_URL } from '@server/constants/api-url.constant';
import { IQueryReturn, toQuery, toQueryPromise } from '@server/utils/to-query.util';
import { rejects } from 'assert';
import { runCypressAsync } from '@server/utils/run-cypress.util';
const cypress = require('cypress');

interface IRequest extends IExpressRequest {
    body: {
        href: string;
    };
    query: {
        page?: number;
        limit: number;
    };
}

interface IResponse extends IExpressResponse<string, void> {}

app.post(API_URL.api.parser.cypressImdb.toString(), async (req: IRequest, res: IResponse) => {
    const [data, error] = await getCypressImdbAsync(req.body.href);
    if (error) {
        return res.status(400).send(error);
    }
    return res.send(data?.id);
});

export const getCypressImdbAsync = async (href: string): Promise<IQueryReturn<{ id: string }>> => {
    return await runCypressAsync<{ id: string }>({
        href: href,
        spec: './cypress/integration/get-imdb.spec.ts',
    });
};
