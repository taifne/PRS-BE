import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';
import { BaseEntity, BaseEntitySchema } from 'src/common/base/schemas/base-entity.schema';
import { auditLogPlugin } from 'src/common/audit/audit-log.plugin';

export type DocumentVersionDocument = DocumentVersion & BaseEntity & Document;

@Schema({ timestamps: true })
export class DocumentVersion extends BaseEntity {
  @ApiProperty({ description: 'Reference to the original document' })
  @Prop({ type: Types.ObjectId, ref: 'DocumentEntity', required: true })
  documentId: Types.ObjectId;

  @ApiProperty({ description: 'Content snapshot of the document' })
  @Prop({ required: true })
  content: string;

  @ApiProperty({ description: 'User who created this version' })
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;

  @ApiProperty({ description: 'Optional version note / description', required: false })
  @Prop({ default: '' })
  note?: string;

  @ApiProperty({ description: 'Version number for ordering' })
  @Prop({ required: true })
  versionNumber: number;

  @ApiProperty({ description: 'Soft delete flag', default: false })
  @Prop({ default: false })
  isDeleted: boolean;
}

export const DocumentVersionSchema = SchemaFactory.createForClass(DocumentVersion);
DocumentVersionSchema.add(BaseEntitySchema);

DocumentVersionSchema.plugin(auditLogPlugin, { collection: 'document_versions' });