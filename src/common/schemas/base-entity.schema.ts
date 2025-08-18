import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { auditPlugin } from '../audit/audit.plugin';
import { addAuditQueryHelpers } from '../audit/audit.query';

export type BaseEntityDocument = BaseEntity & Document;

@Schema({ timestamps: true })
export class BaseEntity {

  @ApiProperty({ description: 'Active flag', default: true })
  @Prop({ default: true })
  isActive: boolean;

  @ApiProperty({ description: 'Created at timestamp', required: false })
  @Prop()
  createdAt?: Date;

  @ApiProperty({ description: 'Updated at timestamp', required: false })
  @Prop()
  updatedAt?: Date;

  @ApiProperty({ description: 'Created by user ID', required: false })
  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy?: Types.ObjectId;

  @ApiProperty({ description: 'Updated by user ID', required: false })
  @Prop({ type: Types.ObjectId, ref: 'User' })
  updatedBy?: Types.ObjectId;
}

export const BaseEntitySchema = SchemaFactory.createForClass(BaseEntity);
BaseEntitySchema.plugin(auditPlugin);
addAuditQueryHelpers(BaseEntitySchema);
