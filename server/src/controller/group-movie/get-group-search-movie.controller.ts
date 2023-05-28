import { IExpressRequest, IExpressResponse, app } from '@server/express-app';
import { API_URL } from '@server/constants/api-url.constant';
import { IGroupMovieResponse } from './get-group-search-movie-list.controller';
import { IQueryReturn } from '@server/utils/to-query.util';
import { dbService } from '../db.service';
import { IImdbResponse } from '../imdb/get-imdb-list.controller';

interface IRequest extends IExpressRequest {
    params: {
        id: string;
    };
    query: {
        page?: number;
        limit: number;
    };
}

interface IResponse extends IExpressResponse<IGroupMovieResponse, void> {}

app.get(API_URL.api.groupMovie.id().toString(), async (req: IRequest, res: IResponse) => {
    const [data, error] = await groupSearchMovieByIdAsync(req.params.id);
    if (error) {
        res.status(400).send('error' + error);
    }
    return res.send(data);
});

export const groupSearchMovieByIdAsync = async (imdb_id: string): Promise<IQueryReturn<IGroupMovieResponse>> => {
    const [movies, error] = await dbService.rezkaMovie.getRezkaMoviesAllAsync({ imdb_id: imdb_id });
    if (error) {
        return [, error];
    }
    // TODO optimize it
    const [allRelations, allRelationsError] = await dbService.rezkaMovieTranslation.getRezkaMovieTranslationAllAsync({});
    if (allRelationsError) {
        return [, allRelationsError];
    }

    const [allTranslation, allTranslationError] = await dbService.translation.getTranslationAllAsync({});
    if (allTranslationError) {
        return [, allTranslationError];
    }

    if (movies?.length) {
        const [imdb, imdbError] = await dbService.imdb.getImdbByIdAsync(imdb_id);
        if (imdbError || !imdb) {
            return [, imdbError || 'empty imdb'];
        }

        const translationRelation = allRelations?.find((tr) => tr.rezka_movie_id === movies[0].id);
        const data: IGroupMovieResponse = {
            rezka_movie: movies[0],
            imdb_info: {
                ...imdb,
                jsonObj: JSON.parse(imdb.json),
            },
            translation: allTranslation?.find((translation) => translation.id === translationRelation?.translation_id),
        };
        delete (data.imdb_info as any).json;

        return [data];
    }
    return [, 'not implemented'];
};
