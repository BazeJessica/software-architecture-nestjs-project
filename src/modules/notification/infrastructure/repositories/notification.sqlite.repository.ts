import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { NotificationEntity } from '../../domain/entities/notification.entity';
import { NotificationRepository } from '../../domain/repositories/notification.repository';
import { SQLiteNotificationEntity } from '../entities/notification.sqlite.entity';
@Injectable()
export class SQLiteNotificationRepository implements NotificationRepository {
  constructor(private readonly dataSource: DataSource) {}

  private toEntity(n: SQLiteNotificationEntity): NotificationEntity {
    return NotificationEntity.reconstitute({
      ...n,
      createdAt: n.createdAt.toISOString(),
    });
  }

  async save(notification: NotificationEntity): Promise<void> {
    const json = notification.toJSON();
    await this.dataSource.getRepository(SQLiteNotificationEntity).save({
      id: json.id as string,
      type: json.type as any,
      title: json.title as string,
      message: json.message as string,
      ownerId: json.ownerId as string,
      link: (json.link as string) ?? undefined,
      isRead: json.isRead as boolean,
    });
  }

  async saveAll(notifications: NotificationEntity[]): Promise<void> {
    const rows = notifications.map((n) => {
      const json = n.toJSON();
      return {
        id: json.id as string,
        type: json.type as any,
        title: json.title as string,
        message: json.message as string,
        ownerId: json.ownerId as string,
        link: (json.link as string) ?? undefined,
        isRead: json.isRead as boolean,
      };
    });
    await this.dataSource.getRepository(SQLiteNotificationEntity).save(rows);
  }

  async findByOwnerId(ownerId: string): Promise<NotificationEntity[]> {
    const rows = await this.dataSource
      .getRepository(SQLiteNotificationEntity)
      .find({ where: { ownerId }, order: { createdAt: 'DESC' } });
    return rows.map((r) => this.toEntity(r));
  }

  async findById(id: string): Promise<NotificationEntity | undefined> {
    const row = await this.dataSource
      .getRepository(SQLiteNotificationEntity)
      .findOne({ where: { id } });
    return row ? this.toEntity(row) : undefined;
  }
}
