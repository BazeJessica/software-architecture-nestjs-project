import { Injectable } from '@nestjs/common';
import { UserEntity } from '../../../users/domain/entities/user.entity';
import { LoggingService } from '../../../shared/logging/domain/services/logging.service';
import { PostEntity } from '../../domain/entities/post.entity';
import { PostRepository } from '../../domain/repositories/post.repository';

@Injectable()
export class GetPostsUseCase {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly loggingService: LoggingService,
  ) {}

  public async execute(tags?: string | undefined, user?: UserEntity): Promise<PostEntity[]> {
    this.loggingService.log('GetPostsUseCase.execute');
    const posts = await this.postRepository.getPosts(tags);

    // Filter based on status and permissions
    return posts.filter((post) => {
      // 1. Accepted posts are visible to everyone
      if (post.status === 'accepted') {
        return true;
      }

      // 2. Unauthenticated users only see accepted posts (already handled above)
      if (!user) {
        return false;
      }

      // 3. Moderators and admins see all posts
      if (user.role === 'moderator' || user.role === 'admin') {
        return true;
      }

      // 4. Authors see their own posts in any status
      if (post.authorId === user.id) {
        return true;
      }

      return false;
    });
  }
}
