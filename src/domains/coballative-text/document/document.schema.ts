import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';
import { auditLogPlugin } from 'src/common/audit/audit-log.plugin';
import { BaseEntity, BaseEntitySchema } from 'src/common/base/schemas/base-entity.schema';

export type DocumentEntityDocument = DocumentEntity & BaseEntity & Document;

@Schema({ timestamps: true })
export class DocumentEntity extends BaseEntity {
  @ApiProperty({ description: 'Document title' })
  @Prop({ required: true })
  title: string;

  @ApiProperty({ description: 'Current content of the document' })
  @Prop({ default: '' })
  content: string;

  @ApiProperty({ description: 'Owner of the document' })
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  ownerId: Types.ObjectId;

  @ApiProperty({ description: 'List of collaborator user IDs', type: [Types.ObjectId] })
  @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
  collaborators: Types.ObjectId[];

  @ApiProperty({ description: 'Soft delete flag', default: false })
  @Prop({ default: false })
  isDeleted: boolean;
}

export const DocumentEntitySchema = SchemaFactory.createForClass(DocumentEntity);
DocumentEntitySchema.add(BaseEntitySchema);

DocumentEntitySchema.plugin(auditLogPlugin, { collection: 'documents' });