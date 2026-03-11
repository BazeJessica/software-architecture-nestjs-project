import { Injectable, NotFoundException } from '@nestjs/common';
import { PostRepository } from '../../domain/repositories/post.repository';

export interface RemoveTagFromPostCommand {
  postId: string;
  tagId: string;
}

@Injectable()
export class RemoveTagFromPostUseCase {
  constructor(private readonly postRepository: PostRepository) {}

  async execute(command: RemoveTagFromPostCommand): Promise<void> {
    const post = await this.postRepository.getPostById(command.postId);
    if (!post) {
      throw new NotFoundException(`Post with id ${command.postId} not found`);
    }

    post.removeTag(command.tagId);
    await this.postRepository.updatePost(post.id, post);
  }
}
