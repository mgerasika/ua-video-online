import { groupMovieByIdAsync } from './get-group-movie-detailed.controller';
import { groupMovieListAsync } from './get-group-movie-list.controller';

export const groupMovie = {
    groupMovieByIdAsync,
    groupMovieListV2Async: groupMovieListAsync,
};
