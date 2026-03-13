import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../users/user.module';
import { SQLiteNotificationEntity } from './infrastructure/entities/notification.sqlite.entity';
import { SQLiteNotificationRepository } from './infrastructure/repositories/notification.sqlite.repository';
import { NotificationRepository } from './domain/repositories/notification.repository';
import { NotificationController } from './infrastructure/controllers/notification.controller';
import { GetNotificationsUseCase } from './application/use-cases/get-notifications.use-case';
import { MarkNotificationReadUseCase } from './application/use-cases/mark-notification-read.use-case';
import { MarkAllNotificationsReadUseCase } from './application/use-cases/mark-all-notifications-read.use-case';
import { NotificationListener } from './application/listeners/notification.listener';

@Module({
  imports: [
    TypeOrmModule.forFeature([SQLiteNotificationEntity]),
    UserModule,
  ],
  controllers: [NotificationController],
  providers: [
    {
      provide: NotificationRepository,
      useClass: SQLiteNotificationRepository,
    },
    GetNotificationsUseCase,
    MarkNotificationReadUseCase,
    MarkAllNotificationsReadUseCase,
    NotificationListener,
  ],
})
export class NotificationModule {}
