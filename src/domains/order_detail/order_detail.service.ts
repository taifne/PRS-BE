// src/orders/order-detail.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateOrderDetailDto } from './dto/order_detail.dto';
import { OrderDetail, OrderDetailDocument } from './order_detail.schema';
import { Order, OrderDocument } from '../order/order.schema';
import { Medicine, MedicineDocument } from '../medidines/medidines.schema';

@Injectable()
export class OrderDetailService {
  constructor(
    @InjectModel(OrderDetail.name)
    private orderDetailModel: Model<OrderDetailDocument>,
    @InjectModel(Order.name)
    private orderModel: Model<OrderDocument>,
    @InjectModel(Medicine.name)
    private medicineModel: Model<MedicineDocument>, // Inject Medicine

  ) {}

async createOrderDetail(dto: {
  orderKey: string;
  medicine: string;
  quantity: number;
  unitPrice: number;
}): Promise<OrderDetail> {
  const totalPrice = dto.quantity * dto.unitPrice;

  // Step 1: Create the OrderDetail
  const orderDetail = await this.orderDetailModel.create({
    medicine: dto.medicine,
    quantity: dto.quantity,
    unitPrice: dto.unitPrice,
    totalPrice,
  });

  // Step 2: Update Order
  const order = await this.orderModel.findOneAndUpdate(
    { orderKey: dto.orderKey },
    {
      $push: { orderDetails: orderDetail._id },
      $inc: { totalAmount: totalPrice }, // ✅ Increment totalAmount
    },
    { new: true }
  );

  if (!order) {
    throw new NotFoundException('Order not found');
  }

  // Step 3: Update medicine stock
  const medicine = await this.medicineModel.findById(dto.medicine);
  if (!medicine) {
    throw new NotFoundException('Medicine not found');
  }

  if (medicine.quantityInStock < dto.quantity) {
    throw new Error('Not enough stock available');
  }

  medicine.quantityInStock -= dto.quantity;
  await medicine.save();

  return orderDetail;
}

async removeOrderDetail(orderDetailId: string, orderKey: string): Promise<void> {
  // Step 1: Find the OrderDetail
  const orderDetail = await this.orderDetailModel.findById(orderDetailId);
  if (!orderDetail) {
    throw new NotFoundException('Order detail not found');
  }

  // Step 2: Remove OrderDetail from Order and update total
  const order = await this.orderModel.findOneAndUpdate(
    { orderKey },
    {
      $pull: { orderDetails: orderDetail._id },
      $inc: { totalAmount: -orderDetail.totalPrice },
    },
    { new: true }
  );

  if (!order) {
    throw new NotFoundException('Order not found');
  }

  // Step 3: Restore medicine stock
  const medicine = await this.medicineModel.findById(orderDetail.medicine);
  if (medicine) {
    medicine.quantityInStock += orderDetail.quantity;
    await medicine.save();
  }

  // Step 4: Delete the order detail entry
  await this.orderDetailModel.findByIdAndDelete(orderDetailId);
}

  async findAll(): Promise<OrderDetail[]> {
    return this.orderDetailModel.find().populate('medicine').exec();
  }

  async findById(id: string): Promise<OrderDetail> {
    const detail = await this.orderDetailModel.findById(id).populate('medicine').exec();
    if (!detail) throw new NotFoundException(`OrderDetail with ID ${id} not found`);
    return detail;
  }
  
}
