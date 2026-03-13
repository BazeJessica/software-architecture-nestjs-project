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

export class PostStatusChangedEventPayload {
  postId: string;
  authorId: string;
  title: string;
  previousStatus: string;
  newStatus: string;
}

export class PostDeletedEventPayload {
  postId: string;
  authorId: string;
  title: string;
  deleterId: string;
}

@Injectable()
export class NotificationListener {
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly userRepository: UserRepository,
  ) {}

  @OnEvent('comment.created')
  async handleCommentCreated(payload: CommentCreatedEventPayload): Promise<void> {
    if (payload.postAuthorId !== payload.authorId) {
      const user = await this.userRepository.getUserById(payload.authorId);
      const username = user ? user.toJSON().username : 'Someone';
      const notification = NotificationEntity.create(
        payload.postAuthorId,
        'New Comment',
        `${username} commented on your post: '${payload.postId}'`,
      );
      await this.notificationRepository.save(notification);
    }
  }

  @OnEvent('post.status-changed')
  async handlePostStatusChanged(payload: PostStatusChangedEventPayload): Promise<void> {
    // 1. If status changed to 'waiting' (PENDING_REVIEW), notify all Moderators
    if (payload.newStatus === 'waiting') {
      const moderators = await this.userRepository.getUsersByRole('moderator');
      for (const mod of moderators) {
        const notification = NotificationEntity.create(
          mod.id,
          'New Post Pending Review',
          `New post pending review: '${payload.title}'`,
        );
        await this.notificationRepository.save(notification);
      }
    }

    // 2. If status changed to 'accepted', notify Author and Followers
    if (payload.newStatus === 'accepted') {
      // Notify Author
      const approvedNotif = NotificationEntity.create(
        payload.authorId,
        'Post Approved',
        `Your post '${payload.title}' has been approved.`,
      );
      await this.notificationRepository.save(approvedNotif);

      // Notify Followers
      const author = await this.userRepository.getUserById(payload.authorId);
      if (author) {
        const username = author.toJSON().username;
        for (const followerId of author.followers) {
          const followNotif = NotificationEntity.create(
            followerId,
            'New Post',
            `${username} published a new post: '${payload.title}'`,
          );
          await this.notificationRepository.save(followNotif);
        }
      }
    }

    // 3. If status changed to 'rejected', notify Author
    if (payload.newStatus === 'rejected') {
      const rejectedNotif = NotificationEntity.create(
        payload.authorId,
        'Post Rejected',
        `Your post '${payload.title}' has been rejected.`,
      );
      await this.notificationRepository.save(rejectedNotif);
    }
  }

  @OnEvent('post.deleted')
  async handlePostDeleted(payload: PostDeletedEventPayload): Promise<void> {
    // Notify creator that post was deleted ONLY if deleted by someone else (Mod/Admin)
    if (payload.deleterId !== payload.authorId) {
      const notification = NotificationEntity.create(
        payload.authorId,
        'Post Deleted',
        `Your post '${payload.title}' was deleted by a moderator.`,
      );
      await this.notificationRepository.save(notification);
    }
  }
}
