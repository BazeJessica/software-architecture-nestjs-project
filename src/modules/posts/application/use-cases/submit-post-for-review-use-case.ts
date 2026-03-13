import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PostRepository } from '../../domain/repositories/post.repository';
import { PostEntity } from '../../domain/entities/post.entity';
import { UserEntity } from '../../../users/domain/entities/user.entity';

@Injectable()
export class SubmitPostForReviewUseCase {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(postId: string, user: UserEntity): Promise<PostEntity> {
    const post = await this.postRepository.getPostById(postId);
    if (!post) {
      throw new NotFoundException(`Post with id ${postId} not found`);
    }

    // Permission check: only author or admin
    if (!user.permissions.posts.canSubmitPostForReview(post)) {
       throw new ForbiddenException('You do not have permission to submit this post for review');
    }

    const previousStatus = post.status;
    post.submitForReview();
    await this.postRepository.submitPostForReview(post.id);

    this.eventEmitter.emit('post.status-changed', {
      postId: post.id,
      authorId: post.authorId,
      title: post.toJSON().title,
      previousStatus,
      newStatus: post.status,
    });

    return post;
  }
}
