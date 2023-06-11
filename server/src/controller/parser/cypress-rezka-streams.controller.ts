import { IExpressRequest, IExpressResponse, app } from '@server/express-app';
import axios from 'axios';
import { API_URL } from '@server/constants/api-url.constant';
import { IQueryReturn, toQuery, toQueryPromise } from '@server/utils/to-query.util';
import { rejects } from 'assert';
import { runCypressAsync } from '@server/utils/run-cypress.util';
const cypress = require('cypress');

export interface IVideoInfoResult {
    en_name: string;
    year: number;
    url: string;
    imdb_rezka_relative_link: string;
    translations: ITranslation[];
}

export interface ITranslation {
    resolutions: IResolutionItem[];
    translation: string;
    data_translator_id: string;
    data_camrip: string;
    data_ads: string;
    data_director: string;
    encoded_video_url: string;
}

export interface IResolutionItem {
    resolution: string;
    streams: string[];
}

// TODO fix swagger  body: {
//     href: string;
// };

interface ICypressStreamBody {
    href: string;
}
interface IRequest extends IExpressRequest {
    body: ICypressStreamBody;
    query: {
        page?: number;
        limit: number;
    };
}

interface IResponse extends IExpressResponse<IVideoInfoResult, void> {}

app.post(API_URL.api.parser.cypressStreams.toString(), async (req: IRequest, res: IResponse) => {
    const [data, error] = await getCypressRezkaStreamsAsync(decodeURIComponent(req.body.href));
    if (error) {
        return res.status(400).send(error);
    }
    return res.send(data);
});

export const getCypressRezkaStreamsAsync = async (href: string): Promise<IQueryReturn<IVideoInfoResult>> => {
    return await runCypressAsync({
        href: decodeURIComponent(href),
        spec: './cypress/integration/get-rezka-streams.spec.ts',
    });
};
