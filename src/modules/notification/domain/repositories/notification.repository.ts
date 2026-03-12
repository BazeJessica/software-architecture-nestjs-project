import { NotificationEntity } from '../entities/notification.entity';

export const NOTIFICATION_REPOSITORY_TOKEN = 'NOTIFICATION_REPOSITORY_TOKEN';

export abstract class NotificationRepository {
  public abstract save(notification: NotificationEntity): Promise<void>;
  public abstract findByOwnerId(ownerId: string): Promise<NotificationEntity[]>;
  public abstract findById(id: string): Promise<NotificationEntity | undefined>;
  public abstract saveAll(notifications: NotificationEntity[]): Promise<void>;
}
