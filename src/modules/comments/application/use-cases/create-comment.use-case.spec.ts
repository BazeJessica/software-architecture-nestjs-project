import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateCommentUseCase } from './create-comment.use-case';
import { CommentRepository } from '../../domain/repository/comment.repository';
import { PostRepository } from '../../../posts/domain/repositories/post.repository';
import { PostEntity } from '../../../posts/domain/entities/post.entity';
import { UnprocessableEntityException, NotFoundException } from '@nestjs/common';

describe('CreateCommentUseCase', () => {
  let useCase: CreateCommentUseCase;
  let commentRepository: jest.Mocked<CommentRepository>;
  let postRepository: jest.Mocked<PostRepository>;
  let eventEmitter: jest.Mocked<EventEmitter2>;

  beforeEach(() => {
    commentRepository = {
      createComment: jest.fn().mockResolvedValue(undefined),
    } as any;
    postRepository = {
      getPostById: jest.fn(),
    } as any;
    eventEmitter = {
      emit: jest.fn(),
    } as any;

    useCase = new CreateCommentUseCase(
      commentRepository,
      postRepository,
      eventEmitter,
    );
  });

  it('should create a comment if post exists and is accepted', async () => {
    const post = {
      id: 'post-id',
      status: 'accepted',
      authorId: 'post-author-id',
    } as any;

    postRepository.getPostById.mockResolvedValue(post);

    const command = {
      postId: 'post-id',
      content: 'This is a valid comment',
      authorId: 'author-id',
    };

    const comment = await useCase.execute(command);

    expect(comment).toBeDefined();
    expect(comment.content).toBe('This is a valid comment');
    expect(commentRepository.createComment).toHaveBeenCalled();
    expect(eventEmitter.emit).toHaveBeenCalledWith(
      'comment.created',
      expect.anything(),
    );
  });

  it('should throw Error if post does not exist', async () => {
    postRepository.getPostById.mockResolvedValue(undefined);

    const command = {
      postId: 'invalid-post-id',
      content: 'Hello',
      authorId: 'author-id',
    };

    await expect(useCase.execute(command)).rejects.toThrow(NotFoundException);
  });

  it('should throw Error if post is not accepted', async () => {
    const post = {
      id: 'post-id',
      status: 'draft',
      authorId: 'post-author-id',
    } as any;

    postRepository.getPostById.mockResolvedValue(post);

    const command = {
      postId: 'post-id',
      content: 'Hello',
      authorId: 'author-id',
    };

    await expect(useCase.execute(command)).rejects.toThrow(UnprocessableEntityException);
  });
});
