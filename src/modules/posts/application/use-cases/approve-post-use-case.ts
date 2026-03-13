import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { LoggingService } from '../../../shared/logging/domain/services/logging.service';
import { PostRepository } from '../../domain/repositories/post.repository';
import { PostEntity } from '../../domain/entities/post.entity';
import { UserEntity } from '../../../users/domain/entities/user.entity';

@Injectable()
export class ApprovePostUseCase {
  constructor(
    private readonly loggingService: LoggingService,
    private readonly postRepository: PostRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  public async execute(id: string, user: UserEntity): Promise<PostEntity> {
    this.loggingService.log('ApprovePostUseCase.execute');
    const post = await this.postRepository.getPostById(id);
    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }

    // Permission check: only moderator or admin
    if (user.role !== 'moderator' && user.role !== 'admin') {
      throw new ForbiddenException('Only moderators or admins can approve posts');
    }

    const previousStatus = post.status;
    post.approve();
    await this.postRepository.approvePost(id);

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
