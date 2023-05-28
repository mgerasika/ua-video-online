import { imdb } from './imdb';
import { tools } from './tools';
import { parser } from './parser';
import { groupMovie } from './group-movie';
import { rezkaMovie } from './rezka-movie';
import { translation } from './translation';
import { rezkaMovieTranslation } from './rezka_movie_translation';

export const dbService = {
    rezkaMovie,
    groupMovie,
    imdb,
    tools,
    parser,
    translation,
    rezkaMovieTranslation,
};
