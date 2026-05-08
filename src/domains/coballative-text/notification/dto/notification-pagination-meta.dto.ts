import { ApiProperty } from '@nestjs/swagger';
import { PaginationMetaDto } from 'src/common';

export class NotificationPaginationMetaDto extends PaginationMetaDto {
  @ApiProperty({ description: 'Number of unread notifications' })
  unreadCount: number;
}