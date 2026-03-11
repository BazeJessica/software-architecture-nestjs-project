import { Inject, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { COMMENT_REPOSITORY_TOKEN } from '../../domain/repositories/comment.repository';
import type { CommentRepository } from '../../domain/repositories/comment.repository';
import { CommentEntity } from '../../domain/entities/comment.entity';
import { PostRepository } from '../../../posts/domain/repositories/post.repository';

export class CommentCreatedEvent {
  constructor(
    public readonly commentId: string,
    public readonly postId: string,
    public readonly authorId: string,
    public readonly postAuthorId: string,
  ) {}
}

export interface CreateCommentCommand {
  postId: string;
  content: string;
  authorId: string;
}

@Injectable()
export class CreateCommentUseCase {
  constructor(
    @Inject(COMMENT_REPOSITORY_TOKEN)
    private readonly commentRepository: CommentRepository,
    private readonly postRepository: PostRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(command: CreateCommentCommand): Promise<CommentEntity> {
    const post = await this.postRepository.getPostById(command.postId);
    if (!post) {
      throw new NotFoundException(`Post with id ${command.postId} not found`);
    }

    if (post.status !== 'accepted') {
      throw new UnprocessableEntityException(
        'Comments can only be added to accepted posts',
      );
    }

    const comment = CommentEntity.create(
      command.content,
      command.postId,
      command.authorId,
    );

    await this.commentRepository.save(comment);

    // Emit event for notifications
    this.eventEmitter.emit(
      'comment.created',
      new CommentCreatedEvent(comment.id, post.id, command.authorId, post.authorId),
    );

    return comment;
  }
}
