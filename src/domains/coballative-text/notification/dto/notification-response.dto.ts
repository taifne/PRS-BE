import { Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class NotificationResponseDto {
  @ApiProperty()
  @Expose({ name: '_id' })
  @Transform(({ obj }) => obj._id?.toString())
  id: string;

  @ApiProperty()
  @Expose()
  @Transform(({ obj }) => obj.userId?.toString())
  userId: string;

  @ApiProperty({ enum: ['collaborator_added', 'viewer_added', 'mention', 'document_shared'] })
  @Expose()
  type: string;

  @ApiProperty()
  @Expose()
  @Transform(({ obj }) => obj.documentId?.toString())
  documentId: string;

  @ApiProperty()
  @Expose()
  @Transform(({ obj }) => obj.actorId?.toString())
  actorId: string;

  @ApiProperty()
  @Expose()
  message: string;

  @ApiProperty()
  @Expose()
  isRead: boolean;

  @ApiProperty()
  @Expose()
  metadata: {
    documentTitle?: string;
    role?: string;
    actorName?: string;
  };

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;
}