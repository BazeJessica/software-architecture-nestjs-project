import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PostDeletedEventPayload } from '../../../posts/domain/events/post-deleted.event';
import { COMMENT_REPOSITORY_TOKEN, CommentRepository } from '../../domain/repository/comment.repository';

@Injectable()
export class CommentCleanupListener {
  constructor(
    @Inject(COMMENT_REPOSITORY_TOKEN)
    private readonly commentRepository: CommentRepository,
  ) {}

  @OnEvent('post.deleted')
  async handlePostDeleted(payload: PostDeletedEventPayload): Promise<void> {
    await this.commentRepository.deleteByPostId(payload.postId);
  }
}
