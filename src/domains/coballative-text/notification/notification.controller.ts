import { Controller, Get, Post, Patch, Delete, Param, Query, Req, Body } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiOkResponse, ApiQuery } from '@nestjs/swagger';
import { NotificationService } from './notification.service';
import { CommonResponseDto } from 'src/common';
import { NotificationResponseDto } from './dto/notification-response.dto';
import { NotificationPaginationMetaDto } from './dto/notification-pagination-meta.dto';

@ApiTags('Notifications')
@ApiBearerAuth()
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @ApiOperation({ summary: 'Get user notifications' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiOkResponse({ type: CommonResponseDto })
  async getUserNotifications(
    @Req() req: any,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<CommonResponseDto<NotificationResponseDto[]>> {
    const userId = req.user._id || req.user.id;
    const result = await this.notificationService.getUserNotifications(userId, page, limit);

    // ✅ Use extended meta with unreadCount
    const meta: NotificationPaginationMetaDto = {
      page: result.page,
      limit: result.limit,
      total: result.total,
      unreadCount: result.unreadCount,
    };

    return CommonResponseDto.ok(result.data, 'Notifications fetched successfully', meta);
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Get unread notifications count' })
  @ApiOkResponse({ type: CommonResponseDto })
  async getUnreadCount(@Req() req: any): Promise<CommonResponseDto<{ count: number }>> {
    const userId = req.user._id || req.user.id;
    const count = await this.notificationService.getUnreadCount(userId);
    return CommonResponseDto.ok({ count }, 'Unread count fetched successfully');
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark notification as read' })
  @ApiOkResponse({ type: CommonResponseDto })
  async markAsRead(
    @Param('id') id: string,
    @Req() req: any,
  ): Promise<CommonResponseDto<NotificationResponseDto>> {
    const userId = req.user._id || req.user.id;
    const notification = await this.notificationService.markAsRead(id, userId);
    return CommonResponseDto.ok(notification, 'Notification marked as read');
  }

  @Patch('mark-all-read')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  @ApiOkResponse({ type: CommonResponseDto })
  async markAllAsRead(@Req() req: any): Promise<CommonResponseDto<{ modifiedCount: number }>> {
    const userId = req.user._id || req.user.id;
    const result = await this.notificationService.markAllAsRead(userId);
    return CommonResponseDto.ok(result, 'All notifications marked as read');
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete notification' })
  @ApiOkResponse({ type: CommonResponseDto })
  async deleteNotification(
    @Param('id') id: string,
    @Req() req: any,
  ): Promise<CommonResponseDto<null>> {
    const userId = req.user._id || req.user.id;
    await this.notificationService.deleteNotification(id, userId);
    return CommonResponseDto.ok(null, 'Notification deleted successfully');
  }
}