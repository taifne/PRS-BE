import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';
import { auditLogPlugin } from 'src/common/audit/audit-log.plugin';
import {
  BaseEntity,
  BaseEntitySchema,
} from 'src/common/schemas/base-entity.schema';

export type RoleDocument = Role & Document;

@Schema()
export class Role extends BaseEntity {
  @ApiProperty({ description: 'Role name' })
  @Prop({ required: true, unique: true, trim: true })
  name: string;

  @ApiProperty({ description: 'Role description', required: false })
  @Prop({ default: '', trim: true })
  description?: string;

  @ApiProperty({ description: 'Array of menu IDs', type: [String] })
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Menu' }], default: [] })
  menus: Types.ObjectId[];
}
export const RoleSchema = SchemaFactory.createForClass(Role);
RoleSchema.add(BaseEntitySchema);

RoleSchema.plugin(auditLogPlugin, { collection: 'roles' });