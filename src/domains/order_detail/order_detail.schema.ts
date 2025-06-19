// src/orders/schemas/order-detail.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Medicine } from '../medidines/medidines.schema';

export type OrderDetailDocument = OrderDetail & Document;

@Schema({ timestamps: true })
export class OrderDetail {
  @Prop({ type: Types.ObjectId, ref: Medicine.name, required: true })
  medicine: Types.ObjectId;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  unitPrice: number;

  @Prop({ required: true })
  totalPrice: number;
}

export const OrderDetailSchema = SchemaFactory.createForClass(OrderDetail);
