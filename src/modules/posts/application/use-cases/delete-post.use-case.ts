import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { LoggingService } from '../../../shared/logging/domain/services/logging.service';
import { PostRepository } from '../../domain/repositories/post.repository';
import { UserEntity } from '../../../users/domain/entities/user.entity';

@Injectable()
export class DeletePostUseCase {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly loggingService: LoggingService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  public async execute(id: string, user: UserEntity): Promise<void> {
    this.loggingService.log('DeletePostUseCase.execute');
    const post = await this.postRepository.getPostById(id);
    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }

    // Permission check:
    // 1. Author can delete their own post
    // 2. Moderator or Admin can delete any post
    const isAuthor = post.authorId === user.id;
    const isPrivileged = user.role === 'moderator' || user.role === 'admin';

    if (!isAuthor && !isPrivileged) {
      throw new ForbiddenException('You do not have permission to delete this post');
    }

    await this.postRepository.deletePost(id);

    this.eventEmitter.emit('post.deleted', {
      postId: post.id,
      authorId: post.authorId,
      title: post.toJSON().title,
      deleterId: user.id,
    });
  }
}
