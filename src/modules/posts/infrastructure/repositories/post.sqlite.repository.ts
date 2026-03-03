import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { PostEntity } from '../../domain/entities/post.entity';
import { PostRepository } from '../../domain/repositories/post.repository';
import { SQLitePostEntity } from '../entities/post.sqlite.entity';

@Injectable()
export class SQLitePostRepository implements PostRepository {
  constructor(private readonly dataSource: DataSource) {}

  public async getPosts(): Promise<PostEntity[]> {
    const data = await this.dataSource.getRepository(SQLitePostEntity).find();

    return data.map((post) => PostEntity.reconstitute({ ...post }));
  }

  public async getPostById(id: string): Promise<PostEntity | undefined> {
    const post = await this.dataSource
      .getRepository(SQLitePostEntity)
      .findOne({ where: { id } });

    return post ? PostEntity.reconstitute({ ...post }) : undefined;
  }

  public async createPost(input: PostEntity): Promise<void> {
    await this.dataSource.getRepository(SQLitePostEntity).save(input.toJSON());
  }

  public async updatePost(id: string, input: PostEntity): Promise<void> {
    await this.dataSource
      .getRepository(SQLitePostEntity)
      .update(id, input.toJSON());
  }

  public async deletePost(id: string): Promise<void> {
    await this.dataSource.getRepository(SQLitePostEntity).delete(id);
  }
}
