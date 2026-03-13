import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { NotificationRepository } from '../../domain/repositories/notification.repository';

@Injectable()
export class MarkNotificationReadUseCase {
  constructor(private readonly notificationRepository: NotificationRepository) {}

  async execute(userId: string, notificationId: string): Promise<void> {
    const notification = await this.notificationRepository.getNotificationById(notificationId);
    
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    if (notification.userId !== userId) {
      throw new ForbiddenException('You can only mark your own notifications as read');
    }

    const readNotification = notification.markAsRead();
    await this.notificationRepository.save(readNotification);
  }
}
