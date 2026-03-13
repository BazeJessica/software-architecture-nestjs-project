import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PostRepository } from '../../domain/repositories/post.repository';
import { TagRepository } from 'src/modules/tags/domain/repository/tag.repository';
import { Inject } from '@nestjs/common';
import { UserEntity } from '../../../users/domain/entities/user.entity';

export interface AddTagToPostCommand {
  postId: string;
  tagId: string;
}

@Injectable()
export class AddTagToPostUseCase {
  constructor(
    private readonly postRepository: PostRepository,
    @Inject()
    private readonly tagRepository: TagRepository,
  ) {}

  async execute(command: AddTagToPostCommand, user: UserEntity): Promise<void> {
    const post = await this.postRepository.getPostById(command.postId);
    if (!post) {
      throw new NotFoundException(`Post with id ${command.postId} not found`);
    }

    // Permission check: only author or admin
    if (post.authorId !== user.id && user.role !== 'admin') {
      throw new ForbiddenException('You do not have permission to add tags to this post');
    }

    const tag = await this.tagRepository.findById(command.tagId);
    if (!tag) {
      throw new NotFoundException(`Tag with id ${command.tagId} not found`);
    }

    post.addTag(tag);
    await this.postRepository.updatePost(post.id, post);
  }
}
