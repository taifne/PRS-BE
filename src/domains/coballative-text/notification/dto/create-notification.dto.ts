import { IsEnum, IsMongoId, IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';
import { NotificationType } from '../notification.schema';

export class CreateNotificationDto {
  @IsMongoId()
  @IsNotEmpty()
  userId: string;

  @IsEnum(NotificationType)
  @IsNotEmpty()
  type: NotificationType;

  @IsMongoId()
  @IsNotEmpty()
  documentId: string;

  @IsMongoId()
  @IsNotEmpty()
  actorId: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsObject()
  @IsOptional()
  metadata?: {
    documentTitle?: string;
    role?: string;
    actorName?: string;
  };
}