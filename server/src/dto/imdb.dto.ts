import { IImdbResultResponse } from '@server/controller/imdb/search-imdb.controller';
import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn, Check } from 'typeorm';

export interface IImdbDto {
    id: string;

    en_name: string;

    ua_name?: string;

    poster: string;

    imdb_rating: number;

    year: number;

    jsonObj: IImdbResultResponse;
}
@Entity('imdb')
export class ImdbDto implements Omit<IImdbDto, 'jsonObj'> {
    @PrimaryColumn('text', { nullable: false, unique: true })
    id!: string;

    @Column({ nullable: true, type: 'text' })
    en_name!: string;

    @Column({ nullable: true, type: 'text' })
    ua_name?: string;

    @Column({ nullable: true, type: 'text' })
    poster!: string;

    @Column({ nullable: false, type: 'numeric' })
    imdb_rating!: number;

    @Column({ nullable: false, type: 'numeric' })
    year!: number;

    @Column({ nullable: true, type: 'json' })
    json!: string;

    constructor(id: string) {
        this.id = id;
    }
}
