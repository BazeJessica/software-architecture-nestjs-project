import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('comments')
export class SQLiteCommentEntity {
  @PrimaryColumn()
  id: string;

  @Column('text')
  content: string;

  @Column()
  postId: string;

  @Column()
  authorId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
