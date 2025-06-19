// src/menus/schemas/menu.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MenuDocument = Menu & Document;

@Schema({ timestamps: true })
export class Menu {
  @Prop({ required: true, unique: true })
  name: string; // unique key like 'dashboard', 'settings'

  @Prop({ required: true })
  label: string; // display name

  @Prop()
  icon?: string;

  @Prop()
  path?: string;

  @Prop({ type: Types.ObjectId, ref: 'Menu', default: null })
  parent?: Menu; // for nested menus

  @Prop({ default: true })
  isActive: boolean;
}

export const MenuSchema = SchemaFactory.createForClass(Menu);
