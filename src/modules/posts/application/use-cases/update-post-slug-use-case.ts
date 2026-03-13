import { PostRepository } from '../../domain/repositories/post.repository';
import { PostEntity } from '../../domain/entities/post.entity';
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserEntity } from '../../../users/domain/entities/user.entity';

@Injectable()
export class UpdatePostSlugUseCase {
  constructor(private readonly postRepository: PostRepository) {}

  async execute(postId: string, newSlug: string, user?: UserEntity): Promise<PostEntity> {
    const post = await this.postRepository.getPostById(postId);
    if (!post) {
      throw new NotFoundException(`Post with id ${postId} not found`);
    }

    // Permission check
    if (user && post.authorId !== user.id && user.role !== 'admin') {
      throw new ForbiddenException('You do not have permission to update the slug of this post');
    }

    const existingWithSlug = await this.postRepository.getPostBySlug(newSlug);
    if (existingWithSlug && existingWithSlug.id !== postId) {
      throw new ConflictException(`Slug "${newSlug}" is already in use`);
    }

    post.updateSlug(newSlug);
    await this.postRepository.updatePost(postId, post);
    return post;
  }
}
