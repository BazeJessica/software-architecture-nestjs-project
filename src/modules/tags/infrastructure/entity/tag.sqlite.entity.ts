import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('tags')
export class SQLiteTagEntity {
    @PrimaryColumn()
    id: string;

    @Column({unique: true})
    name: string;

    @Column({type: 'datetime', default()=> 'CURRENT TIMESTAMP '})
    createdAt: Date;
}
