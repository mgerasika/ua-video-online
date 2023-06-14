import { groupMovieListAsync } from './get-group-movie-list.controller';
import { groupMovieByIdAsync } from './get-group-movie-detailed.controller';
import { groupMovieListV2Async } from './get-group-movie-list-v2.controller';

export const groupMovie = {
    groupMovieListAsync,
    groupMovieByIdAsync,
    groupMovieListV2Async,
};
