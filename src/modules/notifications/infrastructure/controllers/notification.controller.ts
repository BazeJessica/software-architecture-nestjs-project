import { Controller, Get, Patch, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../shared/auth/infrastructure/guards/jwt-auth.guard';
import { Requester } from '../../../shared/auth/infrastructure/decorators/requester.decorator';
import { UserEntity } from '../../../users/domain/entities/user.entity';
import { GetNotificationsUseCase } from '../../application/use-cases/get-notifications.use-case';
import { MarkNotificationReadUseCase } from '../../application/use-cases/mark-notification-read.use-case';
import { MarkAllNotificationsReadUseCase } from '../../application/use-cases/mark-all-notifications-read.use-case';

@ApiTags('Notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NotificationController {
  constructor(
    private readonly getNotificationsUseCase: GetNotificationsUseCase,
    private readonly markNotificationReadUseCase: MarkNotificationReadUseCase,
    private readonly markAllNotificationsReadUseCase: MarkAllNotificationsReadUseCase,
  ) {}

  @Get()
  @ApiResponse({ status: 200, description: 'Return user notifications.' })
  async getNotifications(@Requester() user: UserEntity) {
    const notifications = await this.getNotificationsUseCase.execute(user.id);
    return { notifications: notifications.map(n => n.toJSON()) };
  }

  @Patch('readAll')
  @ApiResponse({ status: 200, description: 'Mark all notifications as read.' })
  async markAllRead(@Requester() user: UserEntity) {
    await this.markAllNotificationsReadUseCase.execute(user.id);
  }

  @Patch(':id/read')
  @ApiResponse({ status: 200, description: 'Mark a notification as read.' })
  async markRead(
    @Param('id') id: string,
    @Requester() user: UserEntity,
  ) {
    await this.markNotificationReadUseCase.execute(user.id, id);
  }
}
