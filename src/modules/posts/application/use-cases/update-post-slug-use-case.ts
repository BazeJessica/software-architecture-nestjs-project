import { PostRepository } from '../../domain/repositories/post.repository';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
@Injectable()
export class UpdatePostSlugUseCase {
  constructor(private readonly postRepository: PostRepository) {}

  async execute(postId: string, newSlug: string): Promise<void> {
    const post = await this.postRepository.getPostById(postId);
    if (!post) {
      throw new NotFoundException(`Post with id ${postId} not found`);
    }

    const existingWithSlug = await this.postRepository.getPostBySlug(newSlug);
    if (existingWithSlug && existingWithSlug.id !== postId) {
      throw new ConflictException(`Slug "${newSlug}" is already in use`);
    }

    post.updateSlug(newSlug);
    await this.postRepository.updatePost(postId, post);
  }
}
