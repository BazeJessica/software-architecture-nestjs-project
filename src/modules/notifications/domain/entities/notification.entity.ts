import { v4 } from 'uuid';

export class NotificationEntity {
  private constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly title: string,
    public readonly content: string,
    public readonly isRead: boolean,
    public readonly createdAt: Date,
  ) {}

  public static create(
    userId: string,
    title: string,
    content: string,
  ): NotificationEntity {
    return new NotificationEntity(
      v4(),
      userId,
      title,
      content,
      false,
      new Date(),
    );
  }

  public markAsRead(): NotificationEntity {
    return new NotificationEntity(
      this.id,
      this.userId,
      this.title,
      this.content,
      true,
      this.createdAt,
    );
  }

  public toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      title: this.title,
      content: this.content,
      isRead: this.isRead,
      createdAt: this.createdAt.toISOString(),
    };
  }

  public static reconstitute(input: Record<string, unknown>): NotificationEntity {
    return new NotificationEntity(
      input.id as string,
      input.userId as string,
      input.title as string,
      input.content as string,
      input.isRead as boolean,
      new Date(input.createdAt as string),
    );
  }
}
