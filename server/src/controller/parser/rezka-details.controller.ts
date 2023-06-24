import { IExpressRequest, IExpressResponse, app } from '@server/express-app';
import axios from 'axios';
import { API_URL } from '@server/constants/api-url.constant';
import { IQueryReturn, toQuery } from '@server/utils/to-query.util';
import { REZKA_HEADERS } from './rezka-all.controller';
import { dbService } from '../db.service';
import { oneByOneAsync } from '@server/utils/one-by-one-async.util';

const cheerio = require('cheerio');

export interface IRezkaInfoByIdResponse {
    translation_id: string;
    translation_name: string;
    cdn_encoded_video_url: string;
}

interface IRezkaDetailsBody {
    imdb_id: string;
}
interface IRequest extends IExpressRequest {
    body: IRezkaDetailsBody;
}

interface IResponse extends IExpressResponse<IRezkaInfoByIdResponse[], void> {}

app.post(API_URL.api.parser.rezkaDetails.toString(), async (req: IRequest, res: IResponse) => {
    const [data, error] = await parseRezkaDetailsAsync(req.body.imdb_id);
    if (error) {
        return res.status(400).send(error);
    }
    return res.send(data);
});

export const parseRezkaDetailsAsync = async (imdb_id: string): Promise<IQueryReturn<IRezkaInfoByIdResponse[]>> => {
    const [dbMovie, dbMovieError] = await dbService.rezkaMovie.getRezkaMoviesAllAsync({ imdb_id });
    if (dbMovieError) {
        return [undefined, 'dbError ' + dbMovieError];
    }
    if (dbMovie?.length !== 1) {
        return [undefined, `Found wrong count of movies ${dbMovie?.length}`];
    }

    const [dbRelations, dbRelationsError] = await dbService.rezkaMovieTranslation.getRezkaMovieTranslationAllAsync({
        rezka_movie_id: dbMovie[0].id,
    });
    if (dbRelationsError) {
        return [undefined, 'dbRelationsError ' + dbRelationsError];
    }
    if (!dbRelations || dbRelations?.length === 0) {
        return [undefined, `Found wrong count of relations ${dbRelations?.length}`];
    }
    console.log('dbRelations', dbRelations);

    const href = dbMovie.length ? dbMovie[0].href : '';
    const [rezkaResponse, rezkaError] = await toQuery(
        async () =>
            await axios.get(href, {
                ...REZKA_HEADERS,
                headers: {
                    ...REZKA_HEADERS.headers,
                    Cookie: 'SL_G_WPT_TO=en; SL_GWPT_Show_Hide_tmp=1; SL_wptGlobTipTmp=1; PHPSESSID=jr6gjjkc9f6sm0u098kve7mgqv; dle_user_taken=1; dle_user_token=ea6423749f2467cdb72a12e364f4f646; _ym_uid=168749214880430943; _ym_d=1687492148; _ym_isad=1; _ym_hostIndex=0-2%2C1-0; _ym_visorc=b',
                },
            }),
    );
    if (rezkaError) {
        return [undefined, `request error ${href} ` + rezkaError];
    }
    const html = rezkaResponse?.data;
    const $ = cheerio.load(html);
    let year = href.replace('.html', '');
    year = year.substr(year.length - 4);

    const videoId = href.split('/').pop()?.split('-').shift();
    const cookies =
        (rezkaResponse?.headers['set-cookie'] || '')
            .toString()
            .split(';')
            .find((cookie) => cookie.includes('PHPSESSID')) || '';
    const phpSessionId = cookies.split('=').pop() || '';

    console.log('href', href);

    let error: string | undefined = undefined;
    const res: IRezkaInfoByIdResponse[] = [];
    await oneByOneAsync(
        dbRelations.filter((r) => r.translation_id),
        async (activeRelation): Promise<void> => {
            console.log('activeRelation', activeRelation);
            const postDataStr = `id=${videoId}&translator_id=${activeRelation.translation_id}&is_camrip=${activeRelation.data_camrip}&is_ads=${activeRelation.data_ads}&is_director=${activeRelation.data_director}&favs=2eabb15e-3db9-4fc5-861c-c699233fbf36&action=get_movie`;
            const [cdnResponse, cdnError] = await toQuery(
                async () =>
                    await axios({
                        method: 'post',
                        url: `https://rezka.ag/ajax/get_cdn_series/?t=${new Date().getTime()}`,
                        headers: {
                            ...REZKA_HEADERS.headers,
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                            Cookie: `SL_G_WPT_TO=en; SL_GWPT_Show_Hide_tmp=1; SL_wptGlobTipTmp=1; PHPSESSID=${phpSessionId}; dle_user_taken=1; dle_user_token=30f358e2681322bd118c71ab06481604; _ym_uid=1684426440709605085; _ym_d=1684426440; _ym_isad=1; _ym_hostIndex=0-3%2C1-0; _ym_visorc=b`,
                            Origin: 'https://rezka.ag',
                            Referrer: href,
                            Host: 'rezka.ag',
                        },
                        data: postDataStr,
                    }),
            );
            if (cdnError) {
                error = 'get cdn error ' + cdnError + ' postData = ' + postDataStr;
                return;
            }
            if (!cdnResponse?.data.success) {
                error =
                    'cdn custom error session_id=' +
                    phpSessionId +
                    ' error =' +
                    cdnResponse?.data?.message +
                    ' href = ' +
                    href +
                    ' postData = ' +
                    postDataStr;
            }
            console.log('get_cdn_series response', cdnResponse?.data);
            console.log('request', postDataStr);
            const [translation] = await dbService.translation.getTranslationByIdAsync(activeRelation.translation_id);
            res.push({
                translation_id: activeRelation.translation_id,
                translation_name: translation?.label || '',
                cdn_encoded_video_url: cdnResponse?.data.url,
            });
        },
    );

    return [res, error];
};
