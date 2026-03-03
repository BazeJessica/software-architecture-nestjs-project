import { v4 } from 'uuid';
import { PostContent } from '../value-objects/post-content.value-object';
import { PostTitle } from '../value-objects/post-title.value-object';

export type PostStatus = 'draft' | 'waiting' | 'accepted' | 'rejected';

export class PostEntity {
  private _title: PostTitle;
  private _content: PostContent;
  private _authorId: string;
  private _status: PostStatus;

  private constructor(
    readonly id: string,
    title: PostTitle,
    content: PostContent,
    authorId: string,
    status: PostStatus,
  ) {
    this._title = title;
    this._content = content;
    this._authorId = authorId;
    this._status = status;
  }

  public get status() {
    return this._status;
  }

  public get authorId() {
    return this._authorId;
  }

  public static reconstitute(input: Record<string, unknown>) {
    return new PostEntity(
      input.id as string,
      new PostTitle(input.title as string),
      new PostContent(input.content as string),
      input.authorId as string,
      input.status as PostStatus,
    );
  }

  public toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      title: this._title.toString(),
      content: this._content.toString(),
      status: this._status,
      authorId: this._authorId,
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
}
