import { CommentEntity } from '../entities/comment.entity';
export abstract class CommentRepository {
  public abstract findAll(): Promise<CommentEntity[]>;

  public abstract findById(id: string): Promise<CommentEntity | null>;

  public abstract findByPostId(postId: string): Promise<CommentEntity[]>;

  public abstract deleteComment(id: string): Promise<void>;

  public abstract createComment(comment: CommentEntity): Promise<void>;

  public abstract updateComment(
    id: string,
    input: CommentEntity,
  ): void | Promise<void>;
}

export const COMMENT_REPOSITORY_TOKEN = 'COMMENT_REPOSITORY_TOKEN';
