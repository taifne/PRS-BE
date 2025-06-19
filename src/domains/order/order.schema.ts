import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { OrderDetail } from '../order_detail/order_detail.schema';
import { User } from '../user/user.schema';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true })
  customerName: string;

  @Prop()
  customerPhone?: string;

  @Prop()
  customerAddress?: string;

  @Prop({ default: 'pending' }) // pending, completed, cancelled, etc.
  status: string;

  @Prop({ default: 0 })
  totalAmount: number;

  @Prop({ type: [Types.ObjectId], ref: OrderDetail.name, default: [] })
  orderDetails: Types.ObjectId[];

  @Prop({ unique: true })
  orderKey: string;
    @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  createdBy: Types.ObjectId;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

OrderSchema.pre('save', function (next) {
  if (!this.orderKey) {
    this.orderKey = `ORD-${new Types.ObjectId().toHexString().slice(-6).toUpperCase()}`;
  }
  next();
});

