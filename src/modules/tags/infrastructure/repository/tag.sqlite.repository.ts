import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TagEntity } from '../../domain/entities/tag.entity';
import { TagRepository } from '../../domain/repository/tag.repository';
import { SQLiteTagEntity } from '../entity/tag.sqlite.entity';

@Injectable()
export class SQLiteTagRepository implements TagRepository {
  constructor(private readonly dataSource: DataSource) {}

  public async updateTag(id: string, input: TagEntity): Promise<void> {
    await this.dataSource
      .getRepository(SQLiteTagEntity)
      .update(id, input.toJSON());
  }

  public async findAll(): Promise<TagEntity[]> {
    const entities = await this.dataSource
      .getRepository(SQLiteTagEntity)
      .find();
    return entities.map((entity) =>
      TagEntity.reconstitute({
        id: entity.id,
        name: entity.name,
        createdAt: entity.createdAt,
      }),
    );
  }

  public async findById(id: string): Promise<TagEntity | null> {
    const entity = await this.dataSource
      .getRepository(SQLiteTagEntity)
      .findOne({ where: { id } });
    if (!entity) return null;
    return TagEntity.reconstitute({
      id: entity.id,
      name: entity.name,
      createdAt: entity.createdAt,
    });
  }

  public async findByName(name: string): Promise<TagEntity | null> {
    const entity = await this.dataSource
      .getRepository(SQLiteTagEntity)
      .findOne({ where: { name } });
    if (!entity) return null;
    return TagEntity.reconstitute({
      id: entity.id,
      name: entity.name,
      createdAt: entity.createdAt,
    });
  }

  public async createTag(input: TagEntity): Promise<void> {
    await this.dataSource.getRepository(SQLiteTagEntity).save(input.toJSON());
  }

  public async deleteTag(id: string): Promise<void> {
    await this.dataSource.getRepository(SQLiteTagEntity).delete(id);
  }
}
