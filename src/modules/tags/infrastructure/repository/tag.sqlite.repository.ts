import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TagEntity } from '../../domain/entities/tag.entity';
import { TagRepository } from '../../domain/repository/tag.repository';
import { SQLiteTagEntity } from '../entity/tag.sqlite.entity';
import { Repository } from 'typeorm';
@Injectable()
export class SQLiteTagRepository implements TagRepository {
  constructor(
    private readonly dataSource: DataSource,
    private readonly repository: Repository<SQLiteTagEntity>,
  ) {}

  public updatetag(id: string, input: TagEntity): void | Promise<void> {
    throw new Error('Method not implemented.');
  }

  public async getTags(): Promise<TagEntity[]> {
    const data = await this.dataSource.getRepository(SQLiteTagEntity).find();
    return data.map((tag) => TagEntity.reconstitute({ ...tag }));
  }

  public async getTagById(id: string): Promise<TagEntity | undefined> {
    const tag = await this.dataSource
      .getRepository(SQLiteTagEntity)
      .findOne({ where: { id } });
    return tag ? TagEntity.reconstitute({ ...tag }) : undefined;
  }

  public async getTagByName(name: string): Promise<TagEntity | undefined> {
    // Useful for checking duplicates when creating/updating tags
    const tag = await this.dataSource
      .getRepository(SQLiteTagEntity)
      .findOne({ where: { name } });
    return tag ? TagEntity.reconstitute({ ...tag }) : undefined;
  }

  public async createTag(input: TagEntity): Promise<void> {
    await this.dataSource.getRepository(SQLiteTagEntity).save(input.toJSON());
  }

  public async updateTag(id: string, input: TagEntity): Promise<void> {
    await this.dataSource
      .getRepository(SQLiteTagEntity)
      .update(id, input.toJSON());
  }

  public async deleteTag(id: string): Promise<void> {
    await this.dataSource.getRepository(SQLiteTagEntity).delete(id);
  }

  async findById(id: string): Promise<TagEntity | null> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) return null;
    return TagEntity.reconstitute({
      id: entity.id,
      name: entity.name,
      createdAt: entity.createdAt,
    });
  }

  async findByName(name: string): Promise<TagEntity | null> {
    const entity = await this.repository.findOne({ where: { name } });
    if (!entity) return null;
    return TagEntity.reconstitute({
      id: entity.id,
      name: entity.name,
      createdAt: entity.createdAt,
    });
  }

  async findAll(): Promise<TagEntity[]> {
    const entities = await this.repository.find();
    return entities.map((entity) =>
      TagEntity.reconstitute({
        id: entity.id,
        name: entity.name,
        createdAt: entity.createdAt,
      }),
    );
  }
}
