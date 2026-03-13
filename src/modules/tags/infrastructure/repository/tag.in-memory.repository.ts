import { Injectable } from '@nestjs/common';
import { TagRepository } from '../../domain/repository/tag.repository';
import { TagEntity } from '../../domain/entities/tag.entity';

@Injectable()
export class InMemoryTagRepository implements TagRepository {
  private tags: Record<string, unknown>[] = [];

  public async findAll(): Promise<TagEntity[]> {
    console.log('InMemoryPostRepository.getTags');
    return Promise.resolve(this.tags.map((tag) => TagEntity.reconstitute(tag)));
  }

  public async findById(id: string): Promise<TagEntity | null> {
    const tag = this.tags.find((tag) => tag.id === id);

    if (tag) {
      return Promise.resolve(TagEntity.reconstitute(tag));
    }
    return Promise.resolve(null);
  }

  public async findByName(name: string): Promise<TagEntity | null> {
    const tag = this.tags.find((tag) => tag.name === name);

    if (tag) {
      return Promise.resolve(TagEntity.reconstitute(tag));
    }
    return Promise.resolve(null);
  }

  public async createTag(input: TagEntity): Promise<void> {
    this.tags.push(input.toJSON());
    return Promise.resolve();
  }

  public async updateTag(id: string, input: TagEntity): Promise<void> {
    this.tags = this.tags.map((tag) => {
      if (tag.id !== id) {
        return tag;
      }
      return input.toJSON();
    });
    return Promise.resolve();
  }

  public async deleteTag(id: string): Promise<void> {
    this.tags = this.tags.filter((tag) => tag.id !== id);
    return Promise.resolve();
  }
}

