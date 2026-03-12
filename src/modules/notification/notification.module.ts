import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SQLiteNotificationRepository } from './infrastructure/repositories/notification.sqlite.repository';
import { SQLiteNotificationEntity } from './infrastructure/entities/notification.sqlite.entity';
import { NotificationsController } from './infrastructure/controllers/notifications.contoller';
import { NotificationEventListener } from './infrastructure/listeners/notification.listeners';
import { NOTIFICATION_REPOSITORY_TOKEN } from './domain/repositories/notification.repository';

@Module({
  imports: [TypeOrmModule.forFeature([SQLiteNotificationEntity])],
  controllers: [NotificationsController],
  providers: [
    {
      provide: NOTIFICATION_REPOSITORY_TOKEN,
      useClass: SQLiteNotificationRepository,
    },
    NotificationEventListener,
  ],
  exports: [NOTIFICATION_REPOSITORY_TOKEN],
})
export class NotificationModule {}
