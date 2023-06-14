import { typeOrmAsync } from '@server/utils/type-orm-async.util';
import { RezkaMovieActorDto } from '@server/dto/rezka_movie_actor.dto';

export const postRezkaMovieActorAsync = async (data: Omit<RezkaMovieActorDto, 'id'>) => {
    return typeOrmAsync<RezkaMovieActorDto>(async (client) => {
        return [await client.getRepository(RezkaMovieActorDto).save(data)];
    });
};
