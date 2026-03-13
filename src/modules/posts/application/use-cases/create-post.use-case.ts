import { Injectable, ForbiddenException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserEntity } from '../../../users/domain/entities/user.entity';
import { PostEntity } from '../../domain/entities/post.entity';
import { PostCreatedEvent } from '../../domain/events/post-created.event';
import { UserCannotCreatePostException } from '../../domain/exceptions/user-cannot-create-post.exception';
import { PostRepository } from '../../domain/repositories/post.repository';
import { CreatePostDto } from '../dtos/create-post.dto';

@Injectable()
export class CreatePostUseCase {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly postRepository: PostRepository,
  ) {}

  public async execute(input: CreatePostDto, user?: UserEntity): Promise<PostEntity> {
    if (user && !user.permissions.posts.canCreate()) {
      throw new UserCannotCreatePostException();
    }

    const post = PostEntity.create(input.title, input.content, input.authorId);
    
    // If a custom slug is provided, use it as the base
    const baseSlug = input.slug ? PostEntity.generateSlug(input.slug) : post.slug;

    let slug = baseSlug;
    let counter = 1;
    let existingPost = await this.postRepository.getPostBySlug(slug);
    while (existingPost) {
      counter++;
      slug = `${baseSlug}-${counter}`;
      existingPost = await this.postRepository.getPostBySlug(slug);
    }
    
    post.updateSlug(slug);

    await this.postRepository.createPost(post);

    this.eventEmitter.emit(PostCreatedEvent, {
      postId: post.id,
      authorId: input.authorId,
      title: input.title,
    });

    return post;
  }
}
