import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  async create(userId: string, createNotificationDto: CreateNotificationDto) {
    const notification = this.notificationRepository.create({
      userId,
      title: createNotificationDto.title,
      message: createNotificationDto.message,
      type: createNotificationDto.type || 'info',
      relatedId: createNotificationDto.relatedId,
    });

    return this.notificationRepository.save(notification);
  }

  async getNotificationsByUser(userId: string) {
    return this.notificationRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async getUnreadCount(userId: string) {
    return this.notificationRepository.count({
      where: { userId, isRead: false },
    });
  }

  async markAsRead(id: string, userId: string) {
    const notification = await this.notificationRepository.findOne({
      where: { id, userId },
    });

    if (!notification) {
      throw new NotFoundException('Notification không tồn tại');
    }

    notification.isRead = true;
    return this.notificationRepository.save(notification);
  }

  async markAllAsRead(userId: string) {
    await this.notificationRepository.update(
      { userId, isRead: false },
      { isRead: true },
    );

    return { message: 'Đã đánh dấu tất cả thông báo đã đọc' };
  }

  async deleteNotification(id: string, userId: string) {
    const notification = await this.notificationRepository.findOne({
      where: { id, userId },
    });

    if (!notification) {
      throw new NotFoundException('Notification không tồn tại');
    }

    await this.notificationRepository.remove(notification);
    return { message: 'Notification đã xóa' };
  }
}