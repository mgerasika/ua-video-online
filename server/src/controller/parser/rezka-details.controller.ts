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
    const [allRezka, allRezkaError] = await dbService.rezkaMovie.getRezkaMoviesAllAsync({ imdb_id });
    if (allRezkaError) {
        return [undefined, allRezkaError];
    }
    if (allRezka?.length !== 1) {
        return [undefined, `Found wrong count of movies ${allRezka?.length}`];
    }
    const href = allRezka.length ? allRezka[0].href : '';
    const [response, error] = await toQuery(() => axios.get(href, REZKA_HEADERS));
    if (error) {
        return [undefined, error];
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

    // const [cdnResponse, cdnError] = await toQuery(() =>
    //     axios({
    //         method: 'post',
    //         url: `https://rezka.ag/ajax/get_cdn_series/?t=${new Date().getTime()}`,
    //         headers: {
    //             ...REZKA_HEADERS.headers,
    //             'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    //             Cookie: `SL_G_WPT_TO=en; SL_GWPT_Show_Hide_tmp=1; SL_wptGlobTipTmp=1; PHPSESSID=3p8hdhuc1f2k5m295ao64qat13; dle_user_taken=1; dle_user_token=30f358e2681322bd118c71ab06481604; _ym_uid=1684426440709605085; _ym_d=1684426440; _ym_isad=1; _ym_hostIndex=0-3%2C1-0; _ym_visorc=b`,
    //             // `PHPSESSID=${phpSessionId}`,
    //             Origin: 'https://rezka.ag',
    //             Referrer: 'https://rezka.ag/series/documentary/57418-makgregor-navsegda-2023.html',
    //         },
    //         data: `id=${videoId}&translator_id=358&is_camrip=0&is_ads=0&is_director=0&action=get_movie`,
    //     }),
    // );
    // if (cdnError) {
    //     return [undefined, cdnError];
    // }
    // if (!cdnResponse?.data.success) {
    //     return [undefined, cdnResponse?.data?.message];
    // }
    // console.log('get_cdn_series', cdnResponse?.data);
    return [
        {
            en_name: $('.b-post__origtitle').text().trim(),
            year: +year,
            imdb_rezka_relative_link: relativeUrl,
            php_session_id: phpSessionId,
            video_id: videoId || '',
            cdn_encoded_video_url:
                // cdnResponse?.data.url ||
                '#hWzM2MHBdaHR0cHM6Ly9zdHJlYW0udm9pZGJvb3N0LmNjL2Q1Mzk3OTdlMWNiZDQzOWU1OTU4NDgyMjI0ZWI5NWVjOjIwMjMwNTI0MTA6TVhKaVdEa3dNVFU1V21WWmVrVXJia1ZvWmxObFJtRnBlV1pIWjBSV1MyZDJla3hySzBKTk9EVlJNbEZOVEVZNFZVbFVaM2RwZEVreVl6aHpjRGMyTlZkMFVUUlVUUzk2YjFOQlRGTkZjMW94TDNsbFdYYzlQUT09LzgvMy8xLzEvMC82LzJzem13Lm1wNDpobHM6bWFuaWZlc3QubTN1OCBvciBodHRwczovL3N0cmVhbS52b2lkYm9vc3QuY2MvZDUzOTc5N2UxY2JkNDM5ZTU5NTg0ODIyMjRlYjk1ZWM6MjAyMzA1MjQxMDpNWEppV0Rrd01UVTVXbVZaZWtVcmJrVm9abE5sUm1GcGVXWkhaMFJXUzJkMmVreHJLMEpOT0RWUk1sRk5URVk0VlVsVVozZHBkRWt5WXpoemNEYzJOVmQwVVRSVVRTOTZiMU5CVEZORmMxb3hM//_//QEBAQEAhIyMhXl5eM2xsV1hjOVBRPT0vOC8zLzEvMS8wLzYvMnN6bXcubXA0LFs0ODBwXWh0dHBzOi8vc3RyZWFtLnZvaWRib29zdC5jYy9iMTlhMTViY2Q2NDViYTFkZmEwYjBjYTVhMmQx//_//Xl5eIUAjIyEhIyM=M2NiNzoyMDIzMDUyNDEwOk1YSmlXRGt3TVRVNVdtVlpla1VyYmtWb1psTmxSbUZwZVdaSFowUldTMmQyZWt4ckswSk5PRFZSTWxGTlRFWTRWVWxVWjNkcGRFa3lZemh6Y0RjMk5WZDBVVFJVVFM5NmIxTkJURk5GYzFveEwzbGxXWGM5UFE9PS84LzMvMS8xLzAvNi9qaTU4OS5tcDQ6aGxzOm1hbmlmZXN0Lm0zdTggb3IgaHR0cHM6Ly9zdHJlYW0udm9pZGJvb3N0LmNjL2IxOWExNWJjZDY0NWJhMWRmYTBiMGNhNWEyZDEzY2I3OjIwMjMwNTI0MTA6TVhKaVdEa3dNVFU1V21WWmVrVXJia1ZvWmxObFJtRnBlV1pIWjBSV1MyZDJla3hySzBKTk9EVlJNbEZOVEVZNFZVbFVaM2RwZEVreVl6aHpjRGMyTlZkMFVUUlVUUzk2YjFOQlRGTkZjMW94TDNsbFdYYzlQUT09LzgvMy8xLzEvMC82L2ppNTg5Lm1wNCxbNzIwcF1odHRwczovL3N0cmVhbS52b2lkYm9vc3QuY2MvOWNlZTgwOTYyNzQ0MmU0MmFlNmVmNjI3YzNiMmM0OTA6MjAyMzA1MjQxMDpNWEppV0Rrd01UVTVXbVZaZWtVcmJrVm9abE5sUm1GcGVXWkhaMFJXUzJkMmVreHJLMEpOT0RWUk1sRk5URVk0VlVsVVozZHBkRWt5WXpoemNEYzJOVmQwVVRSVVRTOTZiMU5CVEZORmMxb3hMM2xsV1hjOVBRPT0vOC//_//JCQjISFAIyFAIyM=8zLzEvMS8wLzYvZG1jYjAubXA0OmhsczptYW5pZmVzdC5tM3U4IG9yIGh0dHBzOi8vc3RyZWFtLnZvaWRib29zdC5jYy85Y//_//JCQhIUAkJEBeIUAjJCRA2VlODA5NjI3NDQyZTQyYWU2ZWY2MjdjM2IyYzQ5MDoyMDIzMDUyNDEwOk1YSmlXRGt3TVRVNVdtVlpla1VyYmtWb1psTmxSbUZwZVdaSFowUldTMmQyZWt4ckswSk5PRFZSTWxGTlRFWTRWVWxVWjNkcGRFa3lZemh6Y0RjMk5WZDBVVFJVVFM5NmIxTkJURk5GYzFveEwzbGxXWGM5UFE9PS84LzMvMS8xLzAvNi9kbWNiMC5tcDQsWzEwODBwXWh0dHBzOi8vc3RyZWFtLnZvaWRib29zdC5jYy80YjVhY2VkNGU3MDQyMzkwMmJiZDRiMjU2YTFlMjEyNToyMDIzMDUyNDEwOk1YSmlXRGt3TVRVNVdtVlpla1VyYmtWb1psTmxSbUZwZVdaSFowUldTMmQyZWt4ckswSk5PRFZSTWxGTlRFWTRWVWxVWjNkcGRFa3lZemh6Y0RjMk5WZDBVVFJVVFM5NmIxTkJURk5GYzFveEwzbGxXWGM5UFE9PS84LzMvMS8xLzAvNi9zaTUzYy5tcDQ6aGxzOm1hbmlmZXN0Lm0zdTggb3IgaHR0cHM6Ly9zdHJlYW0udm9pZGJvb3N0LmNjLzRiNWFjZWQ0ZTcwNDIzOTAyYmJkNGIyNTZhMWUyMTI1OjIwMjMwNTI0MTA6TVhKaVdEa3dNVFU1V21WWmVrVXJia1ZvWmxObFJtRnBlV1pIWjBSV1MyZDJla3hySzBKTk9EVlJNbEZOVEVZNFZVbFVaM2RwZEVreVl6aHpjRGMyTlZkMFVUUlVUUzk2YjFOQlRGTkZjMW94TDNsbFdYYzlQUT09LzgvMy8xLzEvMC82L3NpNTNjLm1wNCxbMTA4MHAgVWx0cmFdaHR0cHM6Ly9zdHJlYW0udm9pZGJvb3N0LmNjLzRiNWFjZWQ0ZTcwNDIzOTAyYmJkNGIyNTZhMWUy//_//IyMjI14hISMjIUBAMTI1OjIwMjMwNTI0MTA6TVhKaVdEa3dNVFU1V21WWmVrVXJia1ZvWmxObFJtRnBlV1pIWjBSV1MyZDJla3hySzBKTk9EVlJNbEZOVEVZNFZVbFVaM2RwZEVreVl6aHpjRGMyTlZkMFVUUlVUUzk2YjFOQlRGTkZjMW94TDNsbFdYYzlQUT09LzgvMy8xLzEvMC82L3NpNTNjLm1wNDpobHM6bWFuaWZlc3QubTN1OCBvciBodHRwczovL3N0cmVhbS52b2lkYm9vc3QuY2MvNGI1YWNlZDRlNzA0MjM5MDJiYmQ0YjI1NmExZTIxMjU6MjAyMzA1MjQxMDpNWEppV0Rrd01UVTVXbVZaZWtVcmJrVm9abE5sUm1GcGVXWkhaMFJXUzJkMmVreHJLMEpOT0RWUk1sRk5URVk0VlVsVVozZHBkRWt5WXpoemNEYzJOVmQwVVRSVVRTOTZiMU5CVEZORmMxb3hMM2xsV1hjOVBRPT0vOC8zLzEvMS8wLzYvc2k1M2MubXA0',
        },
    ];
};
