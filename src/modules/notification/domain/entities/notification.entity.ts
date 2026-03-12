import { v4 } from 'uuid';

export type NotificationType =
  | 'POST_ACCEPTED'
  | 'POST_REJECTED'
  | 'POST_DELETED'
  | 'NEW_COMMENT'
  | 'NEW_FOLLOWER';

export class NotificationEntity {
  private _isRead: boolean;

  private constructor(
    readonly id: string,
    readonly type: NotificationType,
    readonly title: string,
    readonly message: string,
    readonly ownerId: string,
    readonly link: string | null,
    readonly createdAt: Date,
    isRead: boolean,
  ) {
    this._isRead = isRead;
  }

  public get isRead() {
    return this._isRead;
  }

  public static create(
    type: NotificationType,
    title: string,
    message: string,
    ownerId: string,
    link?: string,
  ): NotificationEntity {
    return new NotificationEntity(
      v4(),
      type,
      title,
      message,
      ownerId,
      link ?? null,
      new Date(),
      false,
    );
  }

  public static reconstitute(
    input: Record<string, unknown>,
  ): NotificationEntity {
    return new NotificationEntity(
      input.id as string,
      input.type as NotificationType,
      input.title as string,
      input.message as string,
      input.ownerId as string,
      (input.link as string) ?? null,
      new Date(input.createdAt as string),
      input.isRead as boolean,
    );
  }

  public markAsRead() {
    this._isRead = true;
  }

  public toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      type: this.type,
      title: this.title,
      message: this.message,
      ownerId: this.ownerId,
      link: this.link,
      isRead: this._isRead,
      createdAt: this.createdAt.toISOString(),
    };
  }
}
