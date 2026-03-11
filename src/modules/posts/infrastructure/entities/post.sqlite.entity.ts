import { Column, Entity, PrimaryColumn, ManyToMany, JoinTable} from 'typeorm';
import type { PostStatus } from '../../domain/entities/post.entity';
import { SQLiteTagEntity } from 'src/modules/tags/infrastructure/entity/tag.sqlite.entity';

@Entity('posts')
export class SQLitePostEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column(type: 'text')
  status: PostStatus;

  @Column()
  authorId: string;

  @Column({nullable: true, unique:true})
  slug: string;
  
  @ManyToMany(() => SQLiteTagEntity, { eager: true, cascade: true })
  @JoinTable({
    name: 'posts_tags',
    joinColumn: { name: 'postId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tagId', referencedColumnName: 'id' },
  })
  tags: SQLiteTagEntity[];
}
