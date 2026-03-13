import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { LoggingService } from '../../../shared/logging/domain/services/logging.service';
import { UserEntity } from '../../../users/domain/entities/user.entity';
import { PostEntity } from '../../domain/entities/post.entity';
import { PostRepository } from '../../domain/repositories/post.repository';

@Injectable()
export class GetPostByIdUseCase {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly loggingService: LoggingService,
  ) {}

  public async execute(
    id: string,
    user?: UserEntity,
  ): Promise<PostEntity | undefined> {
    this.loggingService.log('GetPostByIdUseCase.execute');
    const post = await this.postRepository.getPostById(id);
    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }

    // 1. Accepted posts are visible to everyone
    if (post.status === 'accepted') {
      return post;
    }

    // 2. Unauthenticated users only see accepted posts
    if (!user) {
      throw new ForbiddenException('You do not have permission to view this post');
    }

    // 3. Check permissions (ABAC)
    if (!user.permissions.posts.canReadPost(post)) {
      throw new ForbiddenException('You do not have permission to view this post');
    }

    return post;
  }
}
