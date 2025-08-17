import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MenuDocument = Menu & Document;

@Schema({ timestamps: true })
export class Menu {
  @Prop({ required: true, unique: true, index: true })
  name: string;

  @Prop({ required: true })
  label: string;

  @Prop()
  description?: string;

  @Prop()
  icon?: string;

  @Prop()
  path?: string;

  @Prop()
  externalUrl?: string;

  @Prop({ enum: ['route', 'group', 'link', 'divider'], default: 'route' })
  type: 'route' | 'group' | 'link' | 'divider';

  @Prop({ type: Types.ObjectId, ref: 'Menu', default: null, index: true })
  parent?: Types.ObjectId;

  @Prop({ default: 0 })
  order: number;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  hidden: boolean;

  @Prop({ type: [String], default: [] })
  roles: string[];
}

export const MenuSchema = SchemaFactory.createForClass(Menu);
