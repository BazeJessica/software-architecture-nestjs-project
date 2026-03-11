import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CommentEntity } from '../../domain/entities/comment.entity';
import { CommentRepository } from '../../domain/repository/comment.repository';
import { SQLiteCommentEntity } from '../entities/comment.sqlite.entity';

@Injectable()
export class SQLiteCommentRepository implements CommentRepository {
  constructor(private readonly dataSource: DataSource) {}

  async save(comment: CommentEntity): Promise<void> {
    const json = comment.toJSON();
    await this.dataSource.getRepository(SQLiteCommentEntity).save({
      id: json.id as string,
      content: json.content as string,
      postId: json.postId as string,
      authorId: json.authorId as string,
    });
  }

  async findById(id: string): Promise<CommentEntity | null> {
    const entity = await this.dataSource
      .getRepository(SQLiteCommentEntity)
      .findOne({ where: { id } });
    return entity
      ? CommentEntity.reconstitute({
          ...entity,
          createdAt: entity.createdAt.toISOString(),
          updatedAt: entity.updatedAt.toISOString(),
        })
      : null;
  }

  async findByPostId(id: string): Promise<CommentEntity | null> {
    const entity = await this.dataSource
      .getRepository(SQLiteCommentEntity)
      .findOne({ where: { id } });
    if (!entity) return null;
    return CommentEntity.reconstitute({
      ...entity,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    });
  }

  async delete(id: string): Promise<void> {
    await this.dataSource.getRepository(SQLiteCommentEntity).delete(id);
  }

  async countByPostId(postId: string): Promise<number> {
    return this.dataSource
      .getRepository(SQLiteCommentEntity)
      .count({ where: { postId } });
  }
}
