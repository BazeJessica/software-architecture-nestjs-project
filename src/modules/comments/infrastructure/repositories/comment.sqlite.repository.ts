import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CommentEntity } from '../../domain/entities/comment.entity';
import { CommentRepository } from '../../domain/repository/comment.repository';
import { SQLiteCommentEntity } from '../entities/comment.sqlite.entity';

@Injectable()
export class SQLiteCommentRepository implements CommentRepository {
  constructor(private readonly dataSource: DataSource) {}

  async createComment(comment: CommentEntity): Promise<void> {
    const json = comment.toJSON();
    await this.dataSource.getRepository(SQLiteCommentEntity).save({
      id: json.id as string,
      content: json.content as string,
      postId: json.postId as string,
      authorId: json.authorId as string,
    });
  }

  async findAll(): Promise<CommentEntity[]> {
    const entities = await this.dataSource
      .getRepository(SQLiteCommentEntity)
      .find();
    return entities.map(entity => CommentEntity.reconstitute({
      ...entity,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    }));
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

  async findByPostId(postId: string): Promise<CommentEntity[]> {
    const entities = await this.dataSource
      .getRepository(SQLiteCommentEntity)
      .find({ where: { postId } });
    return entities.map(entity => CommentEntity.reconstitute({
      ...entity,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    }));
  }

  async updateComment(id: string, comment: CommentEntity): Promise<void> {
    const json = comment.toJSON();
    await this.dataSource.getRepository(SQLiteCommentEntity).update(id, {
      content: json.content as string,
      updatedAt: new Date(),
    });
  }

  async deleteComment(id: string): Promise<void> {
    await this.dataSource.getRepository(SQLiteCommentEntity).delete(id);
  }
}
