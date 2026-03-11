import { Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PostRepository } from '../../domain/repositories/post.repository';

@Injectable()
export class SubmitPostForReviewUseCase {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(postId: string): Promise<void> {
    const post = await this.postRepository.getPostById(postId);
    if (!post) {
      throw new NotFoundException(`Post with id ${postId} not found`);
    }

    post.submitForReview();
    await this.postRepository.submitPostForReview(post.id);
  }
}
