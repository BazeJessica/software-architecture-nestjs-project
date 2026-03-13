import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { UserEntity } from '../../../users/domain/entities/user.entity';
import { PostRepository } from '../../domain/repositories/post.repository';
import { PostEntity } from '../../domain/entities/post.entity';

@Injectable()
export class GetPostBySlugUseCase {
  constructor(private readonly postRepository: PostRepository) {}

  async execute(slug: string, user?: UserEntity): Promise<PostEntity> {
    const post = await this.postRepository.getPostBySlug(slug);
    if (!post) {
      throw new NotFoundException(`Post with slug "${slug}" not found`);
    }

    // Check visibility
    if (post.status === 'accepted') {
      return post;
    }

    if (!user) {
      throw new ForbiddenException('You do not have permission to view this post');
    }

    if (user.role === 'moderator' || user.role === 'admin') {
      return post;
    }

    if (post.authorId === user.id) {
      return post;
    }

    throw new ForbiddenException('You do not have permission to view this post');
  }
}
