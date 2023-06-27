import { ImdbDto } from '@server/dto/imdb.dto';
import { ENV } from '@server/env';
import { DataSource } from 'typeorm';
import { IQueryReturn } from './to-query.util';
import { RezkaMovieDto } from '@server/dto/rezka-movie.dto';
import { TranslationDto } from '@server/dto/translation.dto';
import { RezkaMovieTranslationDto } from '@server/dto/rezka_movie_translation.dto';
import { ActorDto } from '@server/dto/actor.dto';
import { RezkaMovieActorDto } from '@server/dto/rezka_movie_actor.dto';

const IS_DEBUG = ENV.node_env === 'development';

let _dataSource: DataSource | undefined = undefined;
const getDataSource = (): DataSource => {
    if (_dataSource) {
        return _dataSource;
    }
    _dataSource = new DataSource({
        type: 'postgres',
        username: IS_DEBUG ? ENV.owner_user : ENV.user,
        host: ENV.db_host,
        database: ENV.database,
        password: IS_DEBUG ? ENV.owner_password : ENV.password,
        port: ENV.port,
        entities: [ImdbDto, RezkaMovieDto, TranslationDto, RezkaMovieTranslationDto, ActorDto, RezkaMovieActorDto],
        synchronize: true,
        poolSize: 10,
        logging: false,
    });
    return _dataSource;
};

export async function typeOrmAsync<T>(callback: (client: DataSource) => Promise<IQueryReturn<T>>): Promise<IQueryReturn<T>> {
    let client = getDataSource();
    try {
        if (!client.isInitialized) {
            client = await getDataSource().initialize();
        }
        if (!client.isInitialized) {
            return [, 'Client is not Initialized'];
        }
        const data: IQueryReturn<T> = (await callback(client)) as IQueryReturn<T>;
        return data;
    } catch (error) {
        console.log('typeOrm error ', error);
        return [, error as Error];
    }
}
