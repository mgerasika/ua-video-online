import { imdb } from './imdb';
import { tools } from './tools';
import { parser } from './parser';
import { groupMovie } from './group-movie';
import { rezkaMovie } from './rezka-movie';
import { cypress } from './cypress';
import { stream } from './stream';

export const dbService = {
    rezkaMovie,
    groupMovie,
    imdb,
    tools,
    parser,
    cypress,
    stream,
};
