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
    label: string;
}
@Entity('translation')
export class TranslationDto implements ITranslationDto {
    @PrimaryColumn('text', { nullable: false })
    id!: string;

    @Column({ nullable: true, type: 'text', unique: true })
    label!: string;
}
