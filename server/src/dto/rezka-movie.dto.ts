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

export enum EFilmSubCategory {
    arthouse = 'arthouse',
    western = 'western',
    crime = 'crime',
    fiction = 'fiction',
    horror = 'horror',
    documentary = 'documentary',
    short = 'short',
    family = 'family',
    action = 'action',
    adventures = 'adventures',
    comedy = 'comedy',
    musical = 'musical',
    erotic = 'erotic',
    theatre = 'theatre',
    fantasy = 'fantasy',
    military = 'military',
    drama = 'drama',
    melodrama = 'melodrama',
    kids = 'kids',
    concert = 'concert',
    ukrainian = 'ukrainian',
    biographical = 'biographical',
    detective = 'detective',
    sport = 'sport',
    thriller = 'thriller',
    historical = 'historical',
    travel = 'travel',
    standup = 'standup',
    foreign = 'foreign',
    cognitive = 'cognitive',
}

export enum ECartoonSubCategory {
    fiction = 'fiction',
    comedy = 'comedy',
    melodrama = 'melodrama',
    thriller = 'thriller',
    sport = 'sport',
    kids = 'kids',
    foreign = 'foreign',
    adult = 'adult',
    historical = 'historical',
    family = 'family',
    arthouse = 'arthouse',
    documentary = 'documentary',
    military = 'military',
    horror = 'horror',
    biographical = 'biographical',
    short = 'short',
    musical = 'musical',
    detective = 'detective',
    action = 'action',
    erotic = 'erotic',
    adventures = 'adventures',
    fantasy = 'fantasy',
    ukrainian = 'ukrainian',
    drama = 'drama',
    western = 'western',
    crime = 'crime',
    cognitive = 'cognitive',
    'full-length' = 'full-length',
    fairytale = 'fairytale',
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
