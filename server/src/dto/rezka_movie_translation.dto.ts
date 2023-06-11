import { Entity, Column, PrimaryGeneratedColumn, Unique } from 'typeorm';

export interface IRezkaMovieTranslationDto {
    rezka_movie_id: string;
    translation_id: string;
    data_ads: number;
    data_camrip: number;
    data_director: number;
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

    @Column({ nullable: true, type: 'numeric', unique: false, default: 0 })
    data_ads!: number;

    @Column({ nullable: true, type: 'numeric', unique: false, default: 0 })
    data_camrip!: number;

    @Column({ nullable: true, type: 'numeric', unique: false, default: 0 })
    data_director!: number;
}
