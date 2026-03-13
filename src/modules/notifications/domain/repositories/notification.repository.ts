import { NotificationEntity } from '../entities/notification.entity';

export abstract class NotificationRepository {
  public abstract getUserNotifications(userId: string): Promise<NotificationEntity[]>;
  public abstract getNotificationById(id: string): Promise<NotificationEntity | undefined>;
  public abstract save(notification: NotificationEntity): Promise<void>;
  public abstract markAllAsRead(userId: string): Promise<void>;
}
