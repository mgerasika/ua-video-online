import { imdb } from './imdb';
import { tools } from './tools';
import { parser } from './parser';
import { groupMovie } from './group-movie';
import { rezkaMovie } from './rezka-movie';
import { translation } from './translation';
import { rezkaMovieTranslation } from './rezka_movie_translation';
import { actor } from './actor';
import { rezkaMovieActor } from './rezka_movie_actor';
import { cdn } from './cdn';
import { rabbitMQ } from './rabbit-mq';

export const dbService = {
	cdn,
    rezkaMovie,
    groupMovie,
    imdb,
    tools,
    parser,
    translation,
    rezkaMovieTranslation,
    actor,
	rezkaMovieActor,
	rabbitMQ
};
