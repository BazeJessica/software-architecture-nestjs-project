import { Inject, Injectable } from '@nestjs/common';
import { COMMENT_REPOSITORY_TOKEN, CommentRepository } from '../../domain/repository/comment.repository';

@Injectable()
export class CountCommentUseCase {
  constructor(
    @Inject(COMMENT_REPOSITORY_TOKEN)
    private readonly commentRepository: CommentRepository,
  ) {}

  async execute(postId: string): Promise<number> {
    const comments = await this.commentRepository.findByPostId(postId);
    return comments.length;
  }
}
