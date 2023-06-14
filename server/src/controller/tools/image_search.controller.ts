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

interface IRequest extends IExpressRequest {
    body: {
        search: string;
    };
}

interface IResponse extends IExpressResponse<string[], void> {}

app.post(API_URL.api.tools.image_search.toString(), async (req: IRequest, res: IResponse) => {
    const [logs, setupError] = await imageSearchAsync(req.body.search);
    if (setupError) {
        return res.status(400).send(setupError);
    }
    return res.send(logs);
});

export const imageSearchAsync = async (search: string): Promise<IQueryReturn<string[]>> => {
    const urls = [];

    const apiKey = 'AIzaSyC14RFfQfNHFYlAF_uZ_RwJsS8Yi7LyIZc'; // Replace with your Google API key
    const cx = '010448053132122355187:vca3xlqdh4i'; // Replace with your Custom Search Engine ID

    try {
        const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
            params: {
                key: apiKey,
                cx: cx,
                searchType: 'image',
                q: search,
                imgSize: 'xlarge',
                imgType: 'photo',
                num: 1,
            },
        });

        const items = response.data.items;
        for (const item of items) {
            urls.push(item.link); // Output image URLs
        }
    } catch (error: any) {
        return [, error];
    }

    return [urls, undefined];
};
