import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { DataSource } from 'typeorm';
import { NotificationEntity } from '../../domain/entities/notification.entity';
import { SQLiteNotificationEntity } from '../entities/notification.sqlite.entity';
import { CommentCreatedEvent } from '../../../comments/application/use-cases/create-comment.use-case';
import { SQLiteUserEntity } from 'src/modules/users/infrastructure/entities/user.sqlite.entity';
// ─── Events emitted from the Posts module ────────────────────────────────────

export class PostStatusChangedEvent {
  constructor(
    public readonly postId: string,
    public readonly authorId: string,
    public readonly newStatus: string,
  ) {}
}

export class PostDeletedEvent {
  constructor(
    public readonly postId: string,
    public readonly authorId: string,
  ) {}
}

// ─── Listener ────────────────────────────────────────────────────────────────

@Injectable()
export class NotificationEventListener {
  constructor(private readonly dataSource: DataSource) {}

  private async saveNotification(n: NotificationEntity): Promise<void> {
    const json = n.toJSON();
    await this.dataSource.getRepository(SQLiteNotificationEntity).save({
      id: json.id as string,
      type: json.type as any,
      title: json.title as string,
      message: json.message as string,
      ownerId: json.ownerId as string,
      link: (json.link as string) ?? undefined,
      isRead: false,
    });
  }

  @OnEvent('post.status.changed')
  async handlePostStatusChanged(event: PostStatusChangedEvent) {
    let title = '';
    let message = '';

    if (event.newStatus === 'accepted') {
      title = 'Your post was accepted!';
      message = 'A moderator has accepted your post. It is now public.';
    } else if (event.newStatus === 'rejected') {
      title = 'Your post was rejected';
      message = 'A moderator has rejected your post.';
    } else if (event.newStatus === 'waiting') {
      title = 'Your post is under review';
      message = 'Your post has been submitted for review.';
    } else {
      return;
    }

    const notification = NotificationEntity.create(
      event.newStatus === 'accepted'
        ? 'POST_ACCEPTED'
        : event.newStatus === 'rejected'
          ? 'POST_REJECTED'
          : 'POST_ACCEPTED',
      title,
      message,
      event.authorId,
      `/posts/${event.postId}`,
    );

    await this.saveNotification(notification);

    // If accepted, also notify all followers of the author
    if (event.newStatus === 'accepted') {
      const followers = await this.dataSource
        .getRepository(SQLiteUserEntity)
        .find({ where: { id: event.authorId } });

      for (const follow of followers) {
        const n = NotificationEntity.create(
          'POST_ACCEPTED',
          'New post from someone you follow',
          `A writer you follow has published a new post: ${event.postId}`,
          follow.id,
          `/posts/${event.postId}`,
        );
        await this.saveNotification(n);
      }
    }
  }

  @OnEvent('post.deleted')
  async handlePostDeleted(event: PostDeletedEvent) {
    const notification = NotificationEntity.create(
      'POST_DELETED',
      'Your post was deleted',
      'One of your posts has been deleted.',
      event.authorId,
    );
    await this.saveNotification(notification);
  }

  @OnEvent('comment.created')
  async handleCommentCreated(event: CommentCreatedEvent) {
    // Notify the post author about new comment
    if (event.authorId !== event.postAuthorId) {
      const notification = NotificationEntity.create(
        'NEW_COMMENT',
        'New comment on your post',
        'Someone commented on your post.',
        event.postAuthorId,
        `/posts/${event.postId}`,
      );
      await this.saveNotification(notification);
    }

    // Also notify all followers of the commenter
    const follows = await this.dataSource
      .getRepository(SQLiteUserEntity)
      .find({ where: { id: event.authorId } });

    for (const follow of follows) {
      const n = NotificationEntity.create(
        'NEW_COMMENT',
        'Activity from someone you follow',
        'Someone you follow posted a comment.',
        follow.id,
        `/posts/${event.postId}`,
      );
      await this.saveNotification(n);
    }
  }
}
