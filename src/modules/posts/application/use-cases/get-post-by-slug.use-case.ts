import { Injectable, NotFoundException } from '@nestjs/common';
import { PostRepository } from '../../domain/repositories/post.repository';
import { PostEntity } from '../../domain/entities/post.entity';

@Injectable()
export class GetPostBySlugUseCase {
  constructor(private readonly postRepository: PostRepository) {}

  async execute(slug: string): Promise<PostEntity> {
    const post = await this.postRepository.getPostBySlug(slug);
    if (!post) {
      throw new NotFoundException(`Post with slug "${slug}" not found`);
    }
    return post;
  }
}
