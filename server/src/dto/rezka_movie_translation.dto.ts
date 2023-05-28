import { Entity, Column, PrimaryGeneratedColumn, Unique } from 'typeorm';

export interface IRezkaMovieTranslationDto {
    rezka_movie_id: string;
    translation_id: string;
}
@Entity('rezka_movie_translation')
@Unique('UQ_rezka_movie_id_translation_id', ['rezka_movie_id', 'translation_id'])
export class RezkaMovieTranslationDto implements IRezkaMovieTranslationDto {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ nullable: false, type: 'uuid' })
    rezka_movie_id!: string;

    @Column({ nullable: false, type: 'text' })
    translation_id!: string;
}
