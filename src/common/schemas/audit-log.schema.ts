import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AuditLogDocument = AuditLog & Document;

@Schema({ timestamps: true })
export class AuditLog {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;

  @Prop()
  username?: string;

  @Prop({ type: String })
  collection: string;

  @Prop({ type: Types.ObjectId })
  documentId: Types.ObjectId;

  @Prop()
  action: 'create' | 'update' | 'delete';

  @Prop({ type: Object })
  before?: Record<string, any>;

  @Prop({ type: Object })
  after?: Record<string, any>;
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);
