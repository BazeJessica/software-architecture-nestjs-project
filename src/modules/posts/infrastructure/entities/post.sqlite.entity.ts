import { Column, Entity, PrimaryColumn } from 'typeorm';
import type { PostStatus } from '../../domain/entities/post.entity';

@Entity('posts')
export class SQLitePostEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  status: PostStatus;

  @Column()
  authorId: string;
}
