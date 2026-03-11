import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { PostEntity } from '../../domain/entities/post.entity';
import { PostRepository } from '../../domain/repositories/post.repository';
import { SQLitePostEntity } from '../entities/post.sqlite.entity';
import { SQLiteTagEntity } from 'src/modules/tags/infrastructure/entity/tag.sqlite.entity';
@Injectable()
export class SQLitePostRepository implements PostRepository {
  constructor(private readonly dataSource: DataSource) {}

  public async getPosts(): Promise<PostEntity[]> {
    const data = await this.dataSource.getRepository(SQLitePostEntity).find({
      relations: ['tags'],
    });

    return data.map((post) => PostEntity.reconstitute({ ...post }));
  }

  public async getPostById(id: string): Promise<PostEntity | undefined> {
    const post = await this.dataSource
      .getRepository(SQLitePostEntity)
      .findOne({ where: { id }, relations: ['tags'] });

    return post ? PostEntity.reconstitute({ ...post }) : undefined;
  }

  public async createPost(input: PostEntity): Promise<void> {
    const json = input.toJSON();
    const tags = (json.tags as any[]).map((t) => {
      const tagEntity = new SQLiteTagEntity();
      tagEntity.id = t.id;
      tagEntity.name = t.name;
      tagEntity.createdAt = new Date(t.createdAt);
      return tagEntity;
    });

    const postToSave = {
      ...json,
      tags, // attach the tag entities
    };
    await this.dataSource.getRepository(SQLitePostEntity).save(postToSave);
  }

  public async updatePost(id: string, input: PostEntity): Promise<void> {
    const json = input.toJSON();
    const tags = (json.tags as any[]).map((t) => {
      const tagEntity = new SQLiteTagEntity();
      tagEntity.id = t.id;
      tagEntity.name = t.name;
      tagEntity.createdAt = new Date(t.createdAt);
      return tagEntity;
    });

    const updatedPost = {
      ...json,
      id,
      tags,
    };

    await this.dataSource.getRepository(SQLitePostEntity).save(updatedPost);
  }

  public async deletePost(id: string): Promise<void> {
    await this.dataSource.getRepository(SQLitePostEntity).delete(id);
  }

  public async submitPostForReview(id: string): Promise<void> {
    await this.dataSource
      .getRepository(SQLitePostEntity)
      .update(id, { status: 'waiting' });
  }

  public async approvePost(id: string): Promise<void> {
    await this.dataSource
      .getRepository(SQLitePostEntity)
      .update(id, { status: 'accepted' });
  }

  public async rejectPost(id: string): Promise<void> {
    await this.dataSource
      .getRepository(SQLitePostEntity)
      .update(id, { status: 'rejected' });
  }
}
