import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';
import { BaseEntity, BaseEntitySchema } from 'src/common/base/schemas/base-entity.schema';

export enum NotificationType {
  COLLABORATOR_ADDED = 'collaborator_added',
  VIEWER_ADDED = 'viewer_added',
  VIEWER_REMOVED = 'viewer_removed',
  COLLABORATOR_REMOVED = 'collaborator_removed',
  DOCUMENT_SHARED = 'document_shared',
  MENTION = 'mention',
  DOCUMENT_DELETED = 'document_deleted',
  DOCUMENT_RESTORED = 'document_restored',
}

export type NotificationDocument = Notification & BaseEntity & Document;

@Schema({ timestamps: true })
export class Notification extends BaseEntity {
  @ApiProperty({ description: 'User who receives the notification' })
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @ApiProperty({ description: 'Type of notification', enum: NotificationType })
  @Prop({ type: String, enum: NotificationType, required: true })
  type: NotificationType;

  @ApiProperty({ description: 'Related document ID' })
  @Prop({ type: Types.ObjectId, ref: 'DocumentEntity', required: true })
  documentId: Types.ObjectId;

  @ApiProperty({ description: 'User who performed the action' })
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  actorId: Types.ObjectId;

  @ApiProperty({ description: 'Notification message' })
  @Prop({ required: true })
  message: string;

  @ApiProperty({ description: 'Is notification read', default: false })
  @Prop({ default: false })
  isRead: boolean;

  @ApiProperty({ description: 'Additional metadata' })
  @Prop({ type: Object, default: {} })
  metadata: {
    documentTitle?: string;
    role?: string;
    actorName?: string;
  };
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
NotificationSchema.add(BaseEntitySchema);

// Indexes for performance
NotificationSchema.index({ userId: 1, createdAt: -1 });
NotificationSchema.index({ userId: 1, isRead: 1 });