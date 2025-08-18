
import { Document, Types } from 'mongoose';
import { Role } from '../role/role.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity, BaseEntitySchema } from 'src/common/schemas/base-entity.schema';
import { addAuditQueryHelpers } from 'src/common/audit/audit.query';
import { auditLogPlugin } from 'src/common/audit/audit-log.plugin';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User extends BaseEntity {
  _id?: Types.ObjectId;
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  displayName: string;

  @Prop()
  startDate: Date;

  @Prop()
  phone: string;

  @Prop()
  address: string;

  @Prop({ type: [Types.ObjectId], ref: 'Role', default: [] })
  roles: Types.ObjectId[]; 

  @Prop({ default: true })
  isActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.add(BaseEntitySchema);

UserSchema.plugin(auditLogPlugin, { collection: 'users' });