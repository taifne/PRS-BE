import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  BaseEntity,
  BaseEntitySchema,
} from 'src/common/base/schemas/base-entity.schema';
import { auditLogPlugin } from 'src/common/audit/audit-log.plugin';

export type DocumentCursorDocument = DocumentCursor & Document;

@Schema({ timestamps: true })
export class DocumentCursor extends BaseEntity {

  @Prop({ type: Types.ObjectId, required: true, ref: 'Document' })
  documentId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  userId: Types.ObjectId;

  @Prop({ required: true })
  cursorPosition: number;

  @Prop({ required: true })
  selectionStart: number;

  @Prop({ required: true })
  selectionEnd: number;

  @Prop()
  updatedAt: Date; // optional because timestamps already handle this
}

export const DocumentCursorSchema =
  SchemaFactory.createForClass(DocumentCursor);

DocumentCursorSchema.add(BaseEntitySchema);

DocumentCursorSchema.plugin(auditLogPlugin, {
  collection: 'document_cursors',
});