// src/orders/order-detail.controller.ts
import { Controller, Post, Get, Body, Param, Delete } from '@nestjs/common';
import { CreateOrderDetailDto } from './dto/order_detail.dto';
import { OrderDetailService } from './order_detail.service';

@Controller('order-details')
export class OrderDetailController {
  constructor(private readonly orderDetailService: OrderDetailService) {}

  @Post()
  create(@Body() dto: CreateOrderDetailDto) {
    return this.orderDetailService.createOrderDetail(dto);
  }

  @Get()
  findAll() {
    return this.orderDetailService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderDetailService.findById(id);
  }
    @Delete(':orderKey/:orderDetailId')
  async removeOrderDetail(
    @Param('orderKey') orderKey: string,
    @Param('orderDetailId') orderDetailId: string,
  ): Promise<{ message: string }> {
    await this.orderDetailService.removeOrderDetail(orderDetailId, orderKey);
    return { message: 'Order detail removed successfully' };
  }
}
