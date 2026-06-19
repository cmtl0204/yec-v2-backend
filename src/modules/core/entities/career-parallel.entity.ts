import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import {CareerEntity} from "./career.entity";
import {CatalogueEntity} from "./catalogue.entity";
import { UUID } from 'typeorm/driver/mongodb/bson.typings';

@Entity('career_parallels', {schema: 'core'})
export class CareerParallelEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn({
        name: 'created_at',
        type: 'timestamp',
        default: () => 'CURRENT_timestampP',
        comment: 'Fecha de creacion del registro',
    })
    createdAt: Date;

    @UpdateDateColumn({
        name: 'updated_at',
        type: 'timestamp',
        default: () => 'CURRENT_timestampP',
        comment: 'Fecha de actualizacion de la ultima actualizacion del registro',
    })
    updatedAt: Date;

    @DeleteDateColumn({
        name: 'deleted_at',
        type: 'timestamp',
        nullable: true,
        comment: 'Fecha de eliminacion del registro',
    })
    deletedAt: Date;

    @Column({
        name: 'is_enabled',
        type: 'boolean',
        default: true,
        comment: 'true=enabled, false=disabled',
    })
    isEnabled: boolean;

    /** Inverse Relationship **/

    /** Foreign Keys **/
    @ManyToOne(() => CatalogueEntity, {nullable: true})
    @JoinColumn({name: 'academic_period_id'})
    academicPeriod: CatalogueEntity;
    @Column({type: 'uuid', name: 'academic_period_id', nullable:true, comment: 'Foreign Key'})
    academicPeriodId: string;

    @ManyToOne(() => CareerEntity, career => career.parallels)
    @JoinColumn({name: 'career_id'})
    career: CareerEntity;
    @Column({type: 'uuid', name: 'career_id', comment: 'Foreign Key'})
    careerId: string;

    @ManyToOne(() => CatalogueEntity, {nullable: true})
    @JoinColumn({name: 'workday_id'})
    workday: CatalogueEntity;
    @Column({type: 'uuid', name: 'workday_id', comment: 'Foreign Key'})
    workdayId: string;

    @ManyToOne(() => CatalogueEntity, {nullable: true})
    @JoinColumn({name: 'parallel_id'})
    parallel: CatalogueEntity;
    @Column({type: 'uuid', name: 'parallel_id', comment: 'Foreign Key'})
    parallelId: string;

    /** Columns **/
    @Column({
        name: 'capacity',
        type: 'integer',
        nullable: true,
        comment: 'Capacidad',
    })
    capacity: number;
}
