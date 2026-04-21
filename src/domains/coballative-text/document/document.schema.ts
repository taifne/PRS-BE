import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';
import { auditLogPlugin } from 'src/common/audit/audit-log.plugin';
import { BaseEntity, BaseEntitySchema } from 'src/common/base/schemas/base-entity.schema';

export type DocumentEntityDocument = DocumentEntity & BaseEntity & Document;

export enum DocumentPrivacy {
  PUBLIC = 'public',
  PRIVATE = 'private',
}

@Schema({ timestamps: true })
export class DocumentEntity extends BaseEntity {
  @ApiProperty({ description: 'Document title' })
  @Prop({ required: true, trim: true })
  title: string;

  @ApiProperty({ description: 'Current content of the document' })
  @Prop({ default: '' })
  content: string;

  @ApiProperty({ description: 'Owner of the document' })
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  ownerId: Types.ObjectId;

  @ApiProperty({ description: 'List of collaborator user IDs', type: [String] })
  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  collaborators: Types.ObjectId[];

  @ApiProperty({ description: 'List of viewer user IDs', type: [String] })
  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  viewers: Types.ObjectId[];

  @ApiProperty({ description: 'Privacy setting', enum: DocumentPrivacy, default: DocumentPrivacy.PRIVATE })
  @Prop({
    type: String,
    enum: Object.values(DocumentPrivacy),
    default: DocumentPrivacy.PRIVATE,
  })
  privacy: DocumentPrivacy;

  @ApiProperty({ description: 'Document type/category ID' })
  @Prop({ type: Types.ObjectId, ref: 'DocumentTypeEntity', required: false })
  documentTypeId?: Types.ObjectId;

  @ApiProperty({ description: 'Soft delete flag', default: false })
  @Prop({ default: false, index: true })
  isDeleted: boolean;
}

export const DocumentEntitySchema = SchemaFactory.createForClass(DocumentEntity);
DocumentEntitySchema.add(BaseEntitySchema);

// 🔥 Recommended indexes
DocumentEntitySchema.index({ ownerId: 1 });
DocumentEntitySchema.index({ collaborators: 1 });
DocumentEntitySchema.index({ viewers: 1 });
DocumentEntitySchema.index({ documentTypeId: 1 });

// 🔥 Audit log plugin
DocumentEntitySchema.plugin(auditLogPlugin, { collection: 'documents' });