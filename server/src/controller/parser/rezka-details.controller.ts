import { IExpressRequest, IExpressResponse, app } from '@server/express-app';
import axios from 'axios';
import { API_URL } from '@server/constants/api-url.constant';
import { IQueryReturn, toQuery } from '@server/utils/to-query.util';
import { REZKA_HEADERS } from './rezka-all.controller';
import { dbService } from '../db.service';

const cheerio = require('cheerio');

export interface IRezkaInfoByIdResponse {
    en_name: string;
    year: number;
    imdb_rezka_relative_link: string;
    php_session_id: string;
    video_id: string;
    cdn_encoded_video_url: string;
}

interface IRezkaDetailsBody {
    imdb_id: string;
}
interface IRequest extends IExpressRequest {
    body: IRezkaDetailsBody;
}

interface IResponse extends IExpressResponse<IRezkaInfoByIdResponse, void> {}

app.post(API_URL.api.parser.rezkaDetails.toString(), async (req: IRequest, res: IResponse) => {
    const [data, error] = await parseRezkaDetailsAsync(req.body.imdb_id);
    if (error) {
        return res.status(400).send(error);
    }
    return res.send(data);
});

export const parseRezkaDetailsAsync = async (imdb_id: string): Promise<IQueryReturn<IRezkaInfoByIdResponse>> => {
    const [dbMovie, dbMovieError] = await dbService.rezkaMovie.getRezkaMoviesAllAsync({ imdb_id });
    if (dbMovieError) {
        return [undefined, 'dbError ' + dbMovieError];
    }
    if (dbMovie?.length !== 1) {
        return [undefined, `Found wrong count of movies ${dbMovie?.length}`];
    }

    const [dbTranslations, dbTranslationError] = await dbService.translation.getTranslationAllAsync({ imdb_id });
    if (dbTranslationError) {
        return [undefined, 'dbTranslationError ' + dbTranslationError];
    }
    if (!dbTranslations || dbTranslations?.length === 0) {
        return [undefined, `Found wrong count of translations ${dbTranslations?.length}`];
    }
    console.log('dbTranslation', dbTranslations);

    const href = dbMovie.length ? dbMovie[0].href : '';
    const [response, error] = await toQuery(async () => await axios.get(href, REZKA_HEADERS));
    if (error) {
        return [undefined, `request error ${href} ` + error];
    }
    const html = response?.data;
    const $ = cheerio.load(html);
    let year = href.replace('.html', '');
    year = year.substr(year.length - 4);

    const videoId = href.split('/').pop()?.split('-').shift();
    const relativeUrl = $('.b-post__info_rates').find('a').attr('href').trim();
    const cookies =
        (response?.headers['set-cookie'] || '')
            .toString()
            .split(';')
            .find((cookie) => cookie.includes('PHPSESSID')) || '';
    const phpSessionId = cookies.split('=').pop() || '';

    console.log('href', href);

    // TODO refactor -return array
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
                    Referrer: 'https://rezka.ag/series/documentary/57418-makgregor-navsegda-2023.html',
                },
                data: `id=${videoId}&translator_id=${dbTranslations[0].id}&is_camrip=${dbTranslations[0].data_camrip}&is_ads=${dbTranslations[0].data_ads}&is_director=${dbTranslations[0].data_director}&favs=7e980c10-dae0-4b55-a45a-2315678e8e7e&action=get_movie`,
            }),
    );
    if (cdnError) {
        return [undefined, 'cdn error ' + cdnError];
    }
    if (!cdnResponse?.data.success) {
        return [undefined, 'cdn custom error session_id=' + phpSessionId + ' error =' + cdnResponse?.data?.message];
    }
    console.log('get_cdn_series', cdnResponse?.data);
    return [
        {
            en_name: $('.b-post__origtitle').text().trim(),
            year: +year,
            imdb_rezka_relative_link: relativeUrl,
            php_session_id: phpSessionId,
            video_id: videoId || '',
            cdn_encoded_video_url: cdnResponse?.data.url,
        },
    ];
};
