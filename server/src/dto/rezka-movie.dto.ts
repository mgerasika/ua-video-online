import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    JoinColumn,
    ManyToOne,
    RelationId,
    OneToMany,
    ManyToMany,
    JoinTable,
} from 'typeorm';
import { ImdbDto } from './imdb.dto';
import { ITranslationDto, TranslationDto } from './translation.dto';

export enum ERezkaVideoType {
    film = 'film',
    cartoon = 'cartoon',
}

export interface IRezkaMovieDto {
    id: string;

    en_name: string;

    year: number;

    href: string;

    video_type: ERezkaVideoType;

    rezka_imdb_id: string;
}

@Entity('rezka_movie')
export class RezkaMovieDto implements IRezkaMovieDto {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ nullable: true, type: 'text' })
    en_name!: string;

    @Column({ nullable: true, type: 'numeric' })
    year!: number;

    @Column({ nullable: false, type: 'text', unique: true })
    href!: string;

    @Column({
        type: 'enum',
        enum: ERezkaVideoType,
        default: ERezkaVideoType.film,
    })
    video_type!: ERezkaVideoType;

    @Column({ nullable: true, type: 'text' })
    rezka_imdb_id!: string;

    constructor(id: string) {
        this.id = id;
    }
}
