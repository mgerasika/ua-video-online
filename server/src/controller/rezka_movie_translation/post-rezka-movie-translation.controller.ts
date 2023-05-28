import { typeOrmAsync } from '@server/utils/type-orm-async.util';
import { RezkaMovieTranslationDto } from '@server/dto/rezka_movie_translation.dto';

export const postRezkaMovieTranslationAsync = async (data: Omit<RezkaMovieTranslationDto, 'id'>) => {
    return typeOrmAsync<RezkaMovieTranslationDto>(async (client) => {
        return [await client.getRepository(RezkaMovieTranslationDto).save(data)];
    });
};
