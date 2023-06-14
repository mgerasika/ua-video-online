import { IExpressRequest, IExpressResponse, app } from '@server/express-app';
import { API_URL } from '@server/constants/api-url.constant';
import { dbService } from '../db.service';
import { IQueryReturn } from '@server/utils/to-query.util';
import { IRezkaMovieResponse } from '../rezka-movie/get-rezka-movie-list.controller';
import { IImdbResponse } from '../imdb/get-imdb-list.controller';
import { ITranslationResponse } from '../translation/get-translation-list.controller';
import { ERezkaVideoType, RezkaMovieDto } from '@server/dto/rezka-movie.dto';
import { IImdbResultResponse } from '../imdb/search-imdb.controller';
import { sqlAsync } from '@server/utils/sql-async.util';
import { ImdbDto } from '@server/dto/imdb.dto';
import { TranslationDto } from '@server/dto/translation.dto';
import { imdb } from '../imdb';
import { sql_and, sql_where } from '@server/utils/sql.util';

export interface IGroupMovieResponse {
    rate: number;
    year: number;
    genre: string;
    name: string;
    ua_name: string;
    imdb_id: string;
    has_ua?: boolean;
    has_en?: boolean;
    has_kubik?: boolean;
    poster: string;
    video_type: ERezkaVideoType;
}

interface IRequest extends IExpressRequest {
    query: {
        imdb_id?: string;
		actor_id?: string;
		actor_name?: string;
    };
}

interface IResponse extends IExpressResponse<IGroupMovieResponse[], void> {}

app.get(API_URL.api.groupMovieV2.toString(), async (req: IRequest, res: IResponse) => {
    const [data, error] = await groupMovieListV2Async(req.query);
    if (error) {
        return res.status(400).send('error' + error);
    }
    return res.send(data);
});

export const groupMovieListV2Async = async (query: IRequest['query']): Promise<IQueryReturn<IGroupMovieResponse[]>> => {

    const [data, error] = await sqlAsync<
        (Pick<RezkaMovieDto, 'id' | 'video_type' > & ImdbDto & { ts_label_arr: string })[]
    >(async (client) => {
        const { rows } = await client.query(`
		with t2 as (select rezka_movie.id as rezka_id , rezka_movie.video_type, imdb.*, translation.label as ts_label  FROM rezka_movie
			inner join rezka_movie_translation on rezka_movie_translation.rezka_movie_id = rezka_movie.id 
		   inner join translation on rezka_movie_translation.translation_id = translation.id 
		   inner join rezka_movie_actor on rezka_movie.id = rezka_movie_actor.rezka_movie_id 
		   inner join actor on actor.id = rezka_movie_actor.actor_id 
		   inner join imdb on imdb.id = rezka_movie.rezka_imdb_id 
		   ${sql_where('imdb.id', query?.imdb_id)}
		   ${sql_and('actor.id', query?.actor_id)}
		   ${sql_and('actor.name', query?.actor_name)}
	   ),
	   t3 as (select STRING_AGG(ts_label, ',') as ts_label_arr, rezka_id  from t2 group by t2.rezka_id),
	   t4 as (select distinct on (t2.rezka_id) t2.rezka_id, t2.*,t3.ts_label_arr from t2 inner join t3 on t3.rezka_id = t2.rezka_id)
	   select * from t4 order by t4.imdb_rating desc`);
        return rows;
    });
    if (data) {
        return [
            data.map((row) => {
                const imdbJson: IImdbResultResponse = JSON.parse(row.json);
                return {
                    genre: imdbJson.Genre,
                    imdb_id: imdbJson.imdbID,
                    rate: row.imdb_rating,
                    name: row.en_name,
                    ua_name: row.ua_name || '',
                    year: +row.year,
                    has_en: row.ts_label_arr.toLowerCase().includes('ориг'),
                    has_ua: row.ts_label_arr.toLowerCase().includes('укр'),
                    has_kubik: row.ts_label_arr.toLowerCase().includes('кубик'),
                    poster: row.poster,
                    video_type: row.video_type,
                };
            }),
        ];
    } else {
        return [, error];
    }
};
