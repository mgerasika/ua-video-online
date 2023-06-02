import { IExpressRequest, IExpressResponse, app } from '@server/express-app';
import axios from 'axios';
import { API_URL } from '@server/constants/api-url.constant';
import { IQueryReturn, toQuery } from '@server/utils/to-query.util';

export interface IImdbResultResponse {
    Title: string;
    Year: string;
    Rated: string;
    Released: string;
    Runtime: string;
    Genre: string;
    Director: string;
    Writer: string;
    Actors: string;
    Plot: string;
    Language: string;
    Country: string;
    Awards: string;
    Poster: string;
    Ratings: IImdbRating[];
    Metascore: string;
    imdbRating: string;
    imdbVotes: string;
    imdbID: string;
    Type: string;
    DVD: string;
    BoxOffice: string;
    Production: string;
    Website: string;
    Response: string;
}

export interface IImdbRating {
    Source: string;
    Value: string;
}

interface ISearchImdbBody {
    enName: string;
    year: string;
    id?: string;
}
interface IRequest extends IExpressRequest {
    body: ISearchImdbBody;
}

interface IError {
    message: string;
    code: string;
}
interface IResponse extends IExpressResponse<IImdbResultResponse, IError> {}

app.post(API_URL.api.imdb.search.toString(), async (req: IRequest, res: IResponse) => {
    const [data, error] = await searchImdbMovieInfoAsync(req.body.enName, req.body.year, req.body.id);
    if (error) {
        return res.status(400).send();
    }

    return res.send(data);
});

let LAST_USED_SUCCESS_KEY: string | undefined = '';
export const searchImdbMovieInfoAsync = async (
    enMovieName?: string,
    year?: string,
    id?: string,
): Promise<IQueryReturn<IImdbResultResponse>> => {
    const apiKey1 = '1768a885'; //mgerasika@gmail.com
    const apiKey2 = 'f06cfff4'; //mger@ciklum.com
    const apiKey3 = '7a355028'; //oddbox.cypress@gmail.com
    const apiKey4 = 'dbf2d78a'; //kazky.andersona@gmail.com
    const apiKey5 = 'ec9c5470'; //mopsyky.priyately@gmail.com
    const apiKey6 = '6e85ae30'; // mgerasika2@gmail.com

    const apiKeys = [LAST_USED_SUCCESS_KEY, apiKey1, apiKey2, apiKey3, apiKey4, apiKey5, apiKey6].filter((f) => f);

    while (apiKeys.length) {
        let activeKey = apiKeys.shift();

        const p = id ? { i: id } : { t: enMovieName, y: year };
        const [success, error] = await toQuery<IImdbResultResponse>(async () => {
            const d = await axios({
                method: 'get',
                url: 'http://www.omdbapi.com/',
                params: {
                    apikey: activeKey,
                    type: 'movie',
                    ...p,
                },
            });
            if (d.data.Response === 'False') {
                throw 'Error in search id = ' + id;
            }
            return d.data as IImdbResultResponse;
        });
        if (error) {
            if ((error as any)?.response?.status === 401) {
                console.log('search imdb expired key ', activeKey);
                // do nothing, continue and use next apiKey
            } else {
                return [undefined, error];
            }
        }
        if (success) {
            LAST_USED_SUCCESS_KEY = activeKey;
            return [success, error];
        }
    }
    return [undefined, 'use all api keys but not success with search imdb'];
};
