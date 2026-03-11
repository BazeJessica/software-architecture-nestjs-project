import { Inject, Injectable } from '@nestjs/common';
import { CommentEntity } from '../../domain/entities/comment.entity';
import { COMMENT_REPOSITORY_TOKEN } from '../../domain/repository/comment.repository';
import { CommentRepository } from '../../domain/repository/comment.repository';

@Injectable()
export class GetCommentsForPostUseCase {
  constructor(
    @Inject(COMMENT_REPOSITORY_TOKEN)
    private readonly commentRepository: CommentRepository,
  ) {}

  async execute(postId: string): Promise<CommentEntity[]> {
    return this.commentRepository.findByPostId(postId);
  }
}
