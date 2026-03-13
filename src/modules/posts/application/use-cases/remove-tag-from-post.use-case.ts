import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PostRepository } from '../../domain/repositories/post.repository';
import { UserEntity } from '../../../users/domain/entities/user.entity';

export interface RemoveTagFromPostCommand {
  postId: string;
  tagId: string;
}

@Injectable()
export class RemoveTagFromPostUseCase {
  constructor(private readonly postRepository: PostRepository) {}

  async execute(command: RemoveTagFromPostCommand, user: UserEntity): Promise<void> {
    const post = await this.postRepository.getPostById(command.postId);
    if (!post) {
      throw new NotFoundException(`Post with id ${command.postId} not found`);
    }

    // Permission check: only author or admin
    if (post.authorId !== user.id && user.role !== 'admin') {
      throw new ForbiddenException('You do not have permission to remove tags from this post');
    }

    post.removeTag(command.tagId);
    await this.postRepository.updatePost(post.id, post);
  }
}
