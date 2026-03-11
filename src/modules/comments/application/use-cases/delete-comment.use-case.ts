import {
  Inject,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { COMMENT_REPOSITORY_TOKEN } from '../../domain/repositories/comment.repository';
import type { CommentRepository } from '../../domain/repositories/comment.repository';
import type { UserEntity } from '../../../users/domain/entities/user.entity';

export interface DeleteCommentCommand {
  commentId: string;
  requester: UserEntity;
}

@Injectable()
export class DeleteCommentUseCase {
  constructor(
    @Inject(COMMENT_REPOSITORY_TOKEN)
    private readonly commentRepository: CommentRepository,
  ) {}

  async execute(command: DeleteCommentCommand): Promise<void> {
    const comment = await this.commentRepository.findById(command.commentId);
    if (!comment) {
      throw new NotFoundException(`Comment ${command.commentId} not found`);
    }

    const isOwner = comment.authorId === command.requester.id;
    const isPrivileged = ['moderator', 'admin'].includes(command.requester.role);

    if (!isOwner && !isPrivileged) {
      throw new ForbiddenException(
        'You can only delete your own comments, unless you are a moderator or admin',
      );
    }

    await this.commentRepository.delete(command.commentId);
  }
}
