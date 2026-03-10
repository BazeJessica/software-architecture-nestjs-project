import { TagEntity } from '../entities/tag.entity';

export abstract class TagRepository {
  public abstract findAll(): Promise<TagEntity[]>;

  public abstract findById(id: string): Promise<TagEntity | null>;

  public abstract findByName(name: string): Promise<TagEntity | null>;

  public abstract deleteTag(id: string): Promise<void>;

  public abstract createTag(tag: TagEntity): Promise<void>;

  public abstract updatetag(id: string, input: TagEntity): void | Promise<void>;
}

export const TAG_REPOSITORY_TOKEN = 'TAG_REPOSITORY_TOKEN';
