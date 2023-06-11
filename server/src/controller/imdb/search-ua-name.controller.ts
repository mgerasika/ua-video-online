import { IExpressRequest, IExpressResponse, app } from '@server/express-app';
import axios from 'axios';
import { API_URL } from '@server/constants/api-url.constant';
import { IQueryReturn, toQuery } from '@server/utils/to-query.util';
const cheerio = require('cheerio');

export interface IImdbResultResponse {
    uaName: string;
}

interface ISearchUANameImdbBody {
    id?: string;
}
interface IRequest extends IExpressRequest {
    body: ISearchUANameImdbBody;
}

interface IResponse extends IExpressResponse<IImdbResultResponse, any> {}

app.post(API_URL.api.imdb.search_ua_name.toString(), async (req: IRequest, res: IResponse) => {
    const [data, error] = await searchUANameMovieInfoAsync(req.body.id);
    if (error) {
        return res.status(400).send();
    }

    return res.send(data);
});

export const searchUANameMovieInfoAsync = async (id?: string): Promise<IQueryReturn<IImdbResultResponse>> => {
    const [imdbResponse, imdbError] = await toQuery(
        async () =>
            await axios({
                method: 'get',
                url: `https://www.imdb.com/title/${id}/`,
                headers: {
                    accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                    'accept-language': `uk-UA,uk;q=0.9,en-GB;q=0.8,en;q=0.7,en-US;q=0.6`,
                    cookie: 'session-id-time=2082787201l; SL_G_WPT_TO=en; SL_GWPT_Show_Hide_tmp=1; SL_wptGlobTipTmp=1; session-id=135-2962320-6089749; ubid-main=134-7393948-6794040; uu=eyJpZCI6InV1MTFhNDVhYmE4MGI5NDc5MGE0M2QiLCJwcmVmZXJlbmNlcyI6eyJmaW5kX2luY2x1ZGVfYWR1bHQiOmZhbHNlfX0=; session-token=MRryMuOmsrKvPgN5aTEpzzDsAWCxX5kTJ4161Xa+zWal4AP3VXbdTPS5f+rzNMxVL9/cMGq8vd59Fbp5Ok5r11P20y+pgs4/euhhpI4uKqBRHx8aCo78ixpW+igYOEb/umCI4rDx44JONWn638Uf3f1QJeD3hVIt8YXQFAG3HziqHmUP6r4RQRVZxa763n/rAJDUsKviBAo/9lKgS0tnaMK2vTXHlqOQnUQObYMug2s; csm-hit=tb:s-Y5DMRNYDQN2G6811CBA9|1685899841871&t:1685899842249&adb:adblk_no',
                    'user-agent':
                        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36',
                },
            }),
    );
    if (imdbError) {
        return [, 'get cdn error ' + imdbError];
    }

    const html = imdbResponse?.data;
    const $ = cheerio.load(html);

    return [
        {
            uaName: $('[data-testid="hero__pageTitle"]').text(),
        },
    ];
};
