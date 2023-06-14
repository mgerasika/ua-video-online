import { Entity, Column, PrimaryGeneratedColumn, Unique } from 'typeorm';

export interface IRezkaMovieActorDto {
    rezka_movie_id: string;
    actor_id: string;
    is_director: boolean;
    is_actor: boolean;
    is_writer: boolean;
}
@Entity('rezka_movie_actor')
@Unique(
    'UQ_rezka_movie_id_actor_id_is_actor_is_director_is_writer',
    ['rezka_movie_id', 'actor_id', 'is_director', 'is_actor', 'is_writer'],
   
)
export class RezkaMovieActorDto implements IRezkaMovieActorDto {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ nullable: false, type: 'uuid' })
    rezka_movie_id!: string;

    @Column({ nullable: false, type: 'uuid' })
    actor_id!: string;

    @Column({ nullable: false, type: 'boolean' })
    is_director!: boolean;

    @Column({ nullable: false, type: 'boolean' })
    is_writer!: boolean;

    @Column({ nullable: false, type: 'boolean' })
    is_actor!: boolean;
}
