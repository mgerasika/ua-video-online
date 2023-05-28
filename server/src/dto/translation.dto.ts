import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    JoinColumn,
    ManyToOne,
    RelationId,
    PrimaryColumn,
    ManyToMany,
    JoinTable,
} from 'typeorm';

export interface ITranslationDto {
    id: string;
    data_ads: string;
    data_camrip: string;
    data_director: string;
    label: string;
}
@Entity('translation')
export class TranslationDto implements ITranslationDto {
    @PrimaryColumn('text', { nullable: false })
    id!: string;

    @Column({ nullable: true, type: 'text', unique: false })
    data_ads!: string;

    @Column({ nullable: true, type: 'text', unique: false })
    data_camrip!: string;

    @Column({ nullable: true, type: 'text', unique: false })
    data_director!: string;

    @Column({ nullable: true, type: 'text', unique: true })
    label!: string;
}
