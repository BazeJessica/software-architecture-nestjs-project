import { Injectable } from '@nestjs/common';
import { TagRepository } from '../../domain/repository/tag.repository';
import { TagEntity } from '../../domain/entities/tag.entity';

@Injectable()
export class InMemoryTagRepository implements TagRepository {
  private tags: Record<string, unknown>[] = [];

  public getTags(): TagEntity[] {
    console.log('InMemoryPostRepository.getTags');
    return this.tags.map((tag) => TagEntity.reconstitute(tag));
  }

  public getTagById(id: string) {
    const tag = this.tags.find((tag) => tag.id === id);

    if (tag) {
      return TagEntity.reconstitute(tag);
    }
  }
  public createTag(input: TagEntity) {
    this.tags.push(input.toJson());
  }

  public updateTag(id: string, input: TagEntity) {
    this.tags = this.tags.map((tag) => {
      if (tag.id !== id) {
        return tag;
      }
      return input.toJson();
    });
  }

  public deleteTag(id: string) {
    this.tags = this.tags.filter((tag) => tag.id !== id);
  }
}
