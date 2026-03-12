import {
  Inject,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { COMMENT_REPOSITORY_TOKEN } from '../../domain/repository/comment.repository';
import { CommentRepository } from '../../domain/repository/comment.repository';
import { CommentEntity } from '../../domain/entities/comment.entity';

export interface UpdateCommentCommand {
  commentId: string;
  content: string;
  requesterId: string;
}

@Injectable()
export class UpdateCommentUseCase {
  constructor(
    @Inject(COMMENT_REPOSITORY_TOKEN)
    private readonly commentRepository: CommentRepository,
  ) {}

  async execute(command: UpdateCommentCommand): Promise<CommentEntity> {
    const comment = await this.commentRepository.findById(command.commentId);
    if (!comment) {
      throw new NotFoundException(`Comment ${command.commentId} not found`);
    }

    if (comment.authorId !== command.requesterId) {
      throw new ForbiddenException('You can only edit your own comments');
    }

    comment.update(command.content);
    await this.commentRepository.updateComment(comment);
    return comment;
  }
}
