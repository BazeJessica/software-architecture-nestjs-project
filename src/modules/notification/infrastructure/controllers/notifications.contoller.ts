import {
  Controller,
  Get,
  Param,
  Patch,
  UseGuards,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../shared/auth/infrastructure/guards/jwt-auth.guard';
import { Requester } from '../../../shared/auth/infrastructure/decorators/requester.decorator';
import type { UserEntity } from '../../../users/domain/entities/user.entity';
import { NOTIFICATION_REPOSITORY_TOKEN } from '../../domain/repositories/notification.repository';
import type { NotificationRepository } from '../../domain/repositories/notification.repository';
import { Inject } from '@nestjs/common';

@ApiTags('Notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NotificationsController {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY_TOKEN)
    private readonly notificationRepository: NotificationRepository,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get my notifications' })
  @ApiResponse({ status: 200 })
  async getMyNotifications(@Requester() user: UserEntity) {
    const notifications = await this.notificationRepository.findByOwnerId(
      user.id,
    );
    return { notifications: notifications.map((n) => n.toJSON()) };
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark a notification as read' })
  @ApiResponse({ status: 200 })
  async markAsRead(@Param('id') id: string, @Requester() user: UserEntity) {
    const notification = await this.notificationRepository.findById(id);
    if (!notification) {
      throw new NotFoundException(`Notification ${id} not found`);
    }
    if (notification.ownerId !== user.id) {
      throw new ForbiddenException('Not your notification');
    }
    notification.markAsRead();
    await this.notificationRepository.save(notification);
    return notification.toJSON();
  }

  @Patch('read-all')
  @ApiOperation({ summary: 'Mark all my notifications as read' })
  @ApiResponse({ status: 200 })
  async markAllAsRead(@Requester() user: UserEntity) {
    const notifications = await this.notificationRepository.findByOwnerId(
      user.id,
    );
    notifications.forEach((n) => n.markAsRead());
    await this.notificationRepository.saveAll(notifications);
    return { count: notifications.length };
  }
}
