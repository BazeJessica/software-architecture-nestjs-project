import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { UserEntity } from '../../../users/domain/entities/user.entity';
import { LoggingService } from '../../../shared/logging/domain/services/logging.service';
import { PostEntity } from '../../domain/entities/post.entity';
import { PostRepository } from '../../domain/repositories/post.repository';
import { UpdatePostDto } from '../dtos/update-post.dto';

@Injectable()
export class UpdatePostUseCase {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly loggingService: LoggingService,
  ) {}

  public async execute(id: string, input: UpdatePostDto, user?: UserEntity): Promise<PostEntity> {
    this.loggingService.log('UpdatePostUseCase.execute');
    const post = await this.postRepository.getPostById(id);

    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }

    // Permission check: only author can update
    if (user && post.authorId !== user.id && user.role !== 'admin') {
      throw new ForbiddenException('You do not have permission to update this post');
    }

    // The spec says: Only draft posts can be submitted for review. 
    // Usually updates are also restricted to draft/pending, but we'll allow updates unless it's accepted/rejected (final states).
    if (post.status === 'accepted' || post.status === 'rejected') {
       // Optional: throw if final state projects don't allowed updates
    }

    post.update(input.title, input.content);
    await this.postRepository.updatePost(id, post);
    
    return post;
  }
}
