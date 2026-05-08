import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BaseService } from 'src/common';
import { Notification, NotificationDocument, NotificationType } from './notification.schema';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { plainToInstance } from 'class-transformer';
import { NotificationResponseDto } from './dto/notification-response.dto';

@Injectable()
export class NotificationService extends BaseService<NotificationDocument> {
  constructor(
    @InjectModel(Notification.name) private readonly notificationModel: Model<NotificationDocument>,
  ) {
    super(notificationModel);
  }

async createNotification(dto: CreateNotificationDto): Promise<NotificationResponseDto> {
  const notificationData = {
    ...dto,
    userId: new Types.ObjectId(dto.userId),
    documentId: new Types.ObjectId(dto.documentId),
    actorId: new Types.ObjectId(dto.actorId), // ✅ Convert string to ObjectId here
  };
  
  const notification = await this.create(notificationData);
  return plainToInstance(NotificationResponseDto, notification, {
    excludeExtraneousValues: true,
  });
}
  async getUserNotifications(
    userId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    data: NotificationResponseDto[];
    total: number;
    page: number;
    limit: number;
    unreadCount: number;
  }> {
    const filter = { userId: new Types.ObjectId(userId) };
    const skip = (page - 1) * limit;

    const [notifications, total, unreadCount] = await Promise.all([
      this.notificationModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      this.notificationModel.countDocuments(filter),
      this.notificationModel.countDocuments({ ...filter, isRead: false }),
    ]);

    const data = plainToInstance(NotificationResponseDto, notifications, {
      excludeExtraneousValues: true,
    });

    return { data, total, page, limit, unreadCount };
  }

  async markAsRead(notificationId: string, userId: string): Promise<NotificationResponseDto> {
    const notification = await this.notificationModel.findOneAndUpdate(
      { _id: notificationId, userId: new Types.ObjectId(userId) },
      { isRead: true },
      { new: true },
    );

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    return plainToInstance(NotificationResponseDto, notification, {
      excludeExtraneousValues: true,
    });
  }

  async markAllAsRead(userId: string): Promise<{ modifiedCount: number }> {
    const result = await this.notificationModel.updateMany(
      { userId: new Types.ObjectId(userId), isRead: false },
      { isRead: true },
    );
    return { modifiedCount: result.modifiedCount || 0 };
  }

  async deleteNotification(notificationId: string, userId: string): Promise<void> {
    const result = await this.notificationModel.deleteOne({
      _id: notificationId,
      userId: new Types.ObjectId(userId),
    });

    if (result.deletedCount === 0) {
      throw new NotFoundException('Notification not found');
    }
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.notificationModel.countDocuments({
      userId: new Types.ObjectId(userId),
      isRead: false,
    });
  }
}