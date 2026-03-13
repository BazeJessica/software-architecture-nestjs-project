import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { NotificationEntity } from '../../domain/entities/notification.entity';
import { NotificationRepository } from '../../domain/repositories/notification.repository';
import { SQLiteNotificationEntity } from '../entities/notification.sqlite.entity';

@Injectable()
export class SQLiteNotificationRepository implements NotificationRepository {
  constructor(private readonly dataSource: DataSource) {}

  public async getUserNotifications(userId: string): Promise<NotificationEntity[]> {
    const notifications = await this.dataSource
      .getRepository(SQLiteNotificationEntity)
      .find({ where: { userId }, order: { createdAt: 'DESC' } });

    return notifications.map(n => NotificationEntity.reconstitute({
      ...n,
      createdAt: n.createdAt.toISOString()
    }));
  }

  public async getNotificationById(id: string): Promise<NotificationEntity | undefined> {
    const notification = await this.dataSource
      .getRepository(SQLiteNotificationEntity)
      .findOne({ where: { id } });

    return notification ? NotificationEntity.reconstitute({
      ...notification,
      createdAt: notification.createdAt.toISOString()
    }) : undefined;
  }

  public async save(notification: NotificationEntity): Promise<void> {
    const json = notification.toJSON();
    await this.dataSource.getRepository(SQLiteNotificationEntity).save({
      id: json.id,
      userId: json.userId,
      title: json.title,
      content: json.content,
      isRead: json.isRead,
      createdAt: new Date(json.createdAt)
    });
  }

  public async markAllAsRead(userId: string): Promise<void> {
    await this.dataSource.getRepository(SQLiteNotificationEntity).update(
      { userId, isRead: false },
      { isRead: true }
    );
  }
}
