// src/orders/order.controller.ts
import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto/order.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
  @Get('reports/medicine-sales/:month') // e.g., /orders/reports/medicine-sales/2025-06
  async getMedicineSalesInMonth(@Param('month') month: string) {

    return this.orderService.getTopMedicinesByMonth(month);
  }
 @Patch(':orderKey/status')
  async updateStatus(
    @Param('orderKey') orderKey: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.orderService.updateStatusByOrderKey(orderKey, dto);
  }
  @Get('stats/:userId/:month')
  async getUserOrderStats(
    @Param('userId') userId: string,
    @Param('month') month: string, // expects format 'YYYY-MM', e.g. '2025-06'
  ) {
    return this.orderService.getUserOrderStatsForMonth(userId, month);
  }
  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @Get()
  findAll() {
    return this.orderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOrderByOrderKey(id);
  }
  @Delete(':id')
  deleteById(@Param('id') id: string) {
    return this.orderService.deleteById(id);
  }
  @Get('details/:orderKey')
  async getOrderDetailsByOrderKey(@Param('orderKey') orderKey: string) {
    return this.orderService.getOrderDetailsByOrderKey(orderKey);
  }
  @Get('reports/revenue/:year')
getRevenue(@Param('year') year: string) {
  return this.orderService.getMonthlyRevenue(Number(year));
}

@Get('reports/top-medicines/monthly/:year')
async getTopMonthly(@Param('year') year: string) {
  let hihi = await this.orderService.getTopMedicines(Number(year));

  return this.orderService.getTopMedicines(Number(year));
}

@Get('reports/top-medicines/yearly/:year')
getTopYearly(@Param('year') year: string) {
  return this.orderService.getTopMedicinesPerYear(Number(year));
}
}
