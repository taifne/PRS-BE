// src/orders/order-detail.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderDetailController } from './order_detail.controller';
import { OrderDetail, OrderDetailSchema } from './order_detail.schema';
import { OrderDetailService } from './order_detail.service';
import { Order, OrderSchema } from '../order/order.schema';
import { Medicine, MedicineSchema } from '../medidines/medidines.schema';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: OrderDetail.name, schema: OrderDetailSchema },
      { name: Order.name, schema: OrderSchema },
         { name: Medicine.name, schema: MedicineSchema},
    ]),
  ],
  providers: [OrderDetailService],
  controllers: [OrderDetailController],
  exports: [OrderDetailService],
})
export class OrderDetailModule {}
