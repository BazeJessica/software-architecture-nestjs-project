import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationRepository } from '../../domain/repositories/notification.repository';
import { NotificationEntity } from '../../domain/entities/notification.entity';
import { UserRepository } from '../../../users/domain/repositories/user.repository';

export class CommentCreatedEventPayload {
  commentId: string;
  postId: string;
  authorId: string;
  postAuthorId: string;
}

export class PostCreatedEventPayload {
  postId: string;
  authorId: string;
  title: string;
}

@Injectable()
export class NotificationListener {
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly userRepository: UserRepository,
  ) {}

  @OnEvent('comment.created')
  async handleCommentCreated(payload: CommentCreatedEventPayload): Promise<void> {
    // Notify the post author that someone commented on their post
    if (payload.postAuthorId !== payload.authorId) {
      const notification = NotificationEntity.create(
        payload.postAuthorId,
        'New Comment',
        `Someone commented on your post.`,
      );
      await this.notificationRepository.save(notification);
    }
  }

  @OnEvent('post.created')
  async handlePostCreated(payload: PostCreatedEventPayload): Promise<void> {
    // Notify all followers of the author that a new post was published
    const author = await this.userRepository.getUserById(payload.authorId);
    if (!author) return;

    for (const followerId of author.followers) {
      const notification = NotificationEntity.create(
        followerId,
        'New Post',
        `${payload.title} was published by someone you follow.`,
      );
      await this.notificationRepository.save(notification);
    }
  }
}
