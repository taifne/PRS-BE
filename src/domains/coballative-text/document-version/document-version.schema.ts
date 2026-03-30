import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';
import { auditLogPlugin } from 'src/common/audit/audit-log.plugin';
import { BaseEntity, BaseEntitySchema } from 'src/common/base/schemas/base-entity.schema';

export type DocumentVersionDocument = DocumentVersion & BaseEntity & Document;

export class ChangeEntry {
  @ApiProperty({ description: 'Position of the change in the document' })
  @Prop({ required: true })
  position: number;

  @ApiProperty({ description: 'Text inserted at this position', default: '' })
  @Prop({ default: '' })
  insertedText: string;

  @ApiProperty({ description: 'Text deleted at this position', default: '' })
  @Prop({ default: '' })
  deletedText: string;

  @ApiProperty({ description: 'Timestamp of this change', type: Date })
  @Prop({ default: Date.now })
  timestamp: Date;
}

const ChangeEntrySchema = SchemaFactory.createForClass(ChangeEntry);

@Schema({ timestamps: true })
export class DocumentVersion extends BaseEntity {
  @ApiProperty({ description: 'Reference to the original document' })
  @Prop({ type: Types.ObjectId, ref: 'DocumentEntity', required: true })
  documentId: Types.ObjectId;

  @ApiProperty({ description: 'Version number', example: 1 })
  @Prop({ required: true })
  versionNumber: number;

  @ApiProperty({ description: 'Editor who made this version' })
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  editorId: Types.ObjectId;

  @ApiProperty({ description: 'Full content snapshot of the document' })
  @Prop({ default: '' })
  content: string;

  @ApiProperty({ description: 'List of changes in this version', type: [ChangeEntry] })
  @Prop({ type: [ChangeEntrySchema], default: [] })
  changes: ChangeEntry[];
}

export const DocumentVersionSchema = SchemaFactory.createForClass(DocumentVersion);
DocumentVersionSchema.add(BaseEntitySchema);

// Optional: add audit logging for version changes
DocumentVersionSchema.plugin(auditLogPlugin, { collection: 'document_versions' });