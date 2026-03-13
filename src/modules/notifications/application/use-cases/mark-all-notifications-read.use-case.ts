import { Injectable } from '@nestjs/common';
import { NotificationRepository } from '../../domain/repositories/notification.repository';

@Injectable()
export class MarkAllNotificationsReadUseCase {
  constructor(private readonly notificationRepository: NotificationRepository) {}

  async execute(userId: string): Promise<void> {
    await this.notificationRepository.markAllAsRead(userId);
  }
}
