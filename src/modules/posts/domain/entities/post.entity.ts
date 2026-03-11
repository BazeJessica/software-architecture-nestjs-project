import { v4 } from 'uuid';
import { PostContent } from '../value-objects/post-content.value-object';
import { PostTitle } from '../value-objects/post-title.value-object';
import { TagEntity } from 'src/modules/tags/domain/entities/tag.entity';

export type PostStatus = 'draft' | 'waiting' | 'accepted' | 'rejected';

export class PostEntity {
  private _title: PostTitle;
  private _content: PostContent;
  private _authorId: string;
  private _status: PostStatus;
  private _tags: TagEntity[];

  private constructor(
    readonly id: string,
    title: PostTitle,
    content: PostContent,
    authorId: string,
    status: PostStatus,
    tags: TagEntity[] = [],
  ) {
    this._title = title;
    this._content = content;
    this._authorId = authorId;
    this._status = status;
    this._tags = tags;
  }

  public get status() {
    return this._status;
  }

  public get authorId() {
    return this._authorId;
  }

  public get tags() {
    return this._tags;
  }

  public static reconstitute(input: Record<string, unknown>) {
    return new PostEntity(
      input.id as string,
      new PostTitle(input.title as string),
      new PostContent(input.content as string),
      input.authorId as string,
      input.status as PostStatus,
      (input.tags as any[])?.map((t) => TagEntity.reconstitute(t)) || [],
    );
  }

  public toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      title: this._title.toString(),
      content: this._content.toString(),
      status: this._status,
      authorId: this._authorId,
      tags: this._tags.map((t) => t.toJson()),
    };
  }

  public static create(
    title: string,
    content: string,
    authorId: string,
  ): PostEntity {
    return new PostEntity(
      v4(),
      new PostTitle(title),
      new PostContent(content),
      authorId,
      'draft',
    );
  }

  public update(title?: string, content?: string) {
    if (title) {
      this._title = new PostTitle(title);
    }

    if (content) {
      this._content = new PostContent(content);
    }
  }

  public addTag(tag: TagEntity) {
    if (!this._tags.find((t) => t.id === tag.id)) {
      this._tags.push(tag);
    }
  }
 public removeTag(tagId: string) {
    this._tags = this._tags.filter((t) => t.id !== tagId);
  }

  public submitForReview() {
    if (this._status !== 'draft') {
      throw new Error('only draft posts can be submtted for review');
    }

    this._status = 'waiting';
  }

  public approve() {
    if (this._status !== 'waiting') {
      throw new Error('only waiting posts can be approved');
    }

    this._status = 'accepted';
  }

  public reject() {
    if (this._status !== 'waiting') {
      throw new Error('only waiting posts can be rejected');
    }

    this._status = 'rejected';
  }
}
