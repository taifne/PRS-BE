// src/orders/order.service.ts
import { Injectable,NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { OrderDetail, OrderDetailDocument } from '../order_detail/order_detail.schema';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto/order.dto';
import { Order, OrderDocument } from './order.schema';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(OrderDetail.name) private orderDetailModel: Model<OrderDetailDocument>
  ) {}

    // Get Order by orderKey and populate orderDetails
    async getOrderDetailsByOrderKey(orderKey: string) {
      const order = await this.orderModel
        .findOne({ orderKey })
        .populate({
          path: 'orderDetails', // populate the orderDetails field
          populate: { path: 'medicine' }, // populate the medicine field inside orderDetails
        })
        .exec();
  
      if (!order) {
        throw new Error('Order not found');
      }
  
      return order.orderDetails;
    }
  async create(dto: CreateOrderDto): Promise<Order> {
    const { items, ...orderInfo } = dto;

    // Create order details first
    const createdDetails = await this.orderDetailModel.insertMany(
      items.map(item => ({
        ...item,
        _id: new Types.ObjectId(), // allow us to reference them
      }))
    );

    const detailIds = createdDetails.map(d => d._id);

    // Then create the order with those references
    const order = new this.orderModel({
      ...orderInfo,
      orderDetails: detailIds,
    });

    return order.save();
  }

  async findAll() {
    return this.orderModel
      .find()
      .populate({
        path: 'orderDetails',
        populate: { path: 'medicine' },
      })
      .exec();
  }

  async findById(id: string) {
    return this.orderModel
      .findById(id)
      .populate({
        path: 'orderDetails',
        populate: { path: 'medicine' },
      })
      .exec();
  }
  async deleteById(id: string): Promise<void> {
    const result = await this.orderModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }
  }
  async findOrderByOrderKey(orderKey: string): Promise<Order | null> {
    return this.orderModel.findOne({ orderKey }).exec();
  }
  async getMonthlyRevenue(year: number) {
    return this.orderModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${year}-01-01`),
            $lt: new Date(`${year + 1}-01-01`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$createdAt' },
          totalRevenue: { $sum: '$totalAmount' },
        },
      },
      {
        $sort: { '_id': 1 },
      },
    ]);
  }

  // 2. Top Medicines per Month
async getTopMedicines(limit = 5) {
  const orders = await this.orderModel.find()
    .populate({
      path: 'orderDetails',
      model: 'OrderDetail',
      populate: {
        path: 'medicine',
        model: 'Medicine',
      },
    })
    .lean();

  // Flatten all orderDetails
  const allOrderDetails = orders.flatMap(order => (order.orderDetails as any[]) || []);

  const medicineMap: Record<string, { medicine: any; quantity: number }> = {};

  for (const detail of allOrderDetails) {
    const medicine = detail.medicine;

    if (!medicine || !medicine._id) continue;

    const medId = String(medicine._id);
    if (!medicineMap[medId]) {
      medicineMap[medId] = {
        medicine,
        quantity: 0,
      };
    }

    medicineMap[medId].quantity += detail.quantity || 0;
  }

  const topMedicines = Object.values(medicineMap)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, limit)
    .map(({ medicine, quantity }) => ({
      medicineId: medicine._id,
      name: medicine.name,
      quantity,
    }));

  return topMedicines;
}



  // 3. Top Medicines per Year
async getTopMedicinesPerYear(year: number, limit = 5) {
  const start = new Date(`${year}-01-01`);
  const end = new Date(`${year + 1}-01-01`);

  // Step 1: Fetch orders in the year and populate nested details
  const orders = await this.orderModel.find({
    createdAt: { $gte: start, $lt: end },
  })
    .populate({
      path: 'orderDetails',
      model: 'OrderDetail',
      populate: {
        path: 'medicine',
        model: 'Medicine',
      },
    })
    .lean();

  // Step 2: Flatten all OrderDetails
  const allDetails = orders.flatMap(order => (order.orderDetails as any[] || []));

  // Step 3: Aggregate quantity by medicine
  const medicineMap: Record<string, { medicine: any; quantity: number }> = {};

  for (const detail of allDetails) {
    const medicine = detail.medicine;
    if (!medicine || !medicine._id) continue;

    const id = String(medicine._id);
    if (!medicineMap[id]) {
      medicineMap[id] = { medicine, quantity: 0 };
    }

    medicineMap[id].quantity += detail.quantity || 0;
  }

  const topMedicines = Object.values(medicineMap)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, limit)
    .map(({ medicine, quantity }) => ({
      medicineId: medicine._id,
      name: medicine.name,
      quantity,
    }));

  return topMedicines;
}

    async updateStatusByOrderKey(orderKey: string, dto: UpdateOrderStatusDto): Promise<Order> {
    const order = await this.orderModel.findOneAndUpdate(
      { orderKey },
      { status: dto.status },
      { new: true },
    );

    if (!order) {
      throw new NotFoundException(`Order with key ${orderKey} not found`);
    }

    return order;
  }

async getUserOrderStatsForMonth(
  userId: string,
  month: string, // e.g. "2025-06"
): Promise<{ totalOrders: number; totalAmount: number }> {
  // Parse year and month (1-based)
  const [yearStr, monthStr] = month.split('-');
  const year = parseInt(yearStr, 10);
  const monthNum = parseInt(monthStr, 10);

  const startOfMonth = new Date(year, monthNum - 1, 1, 0, 0, 0, 0);
  const startOfNextMonth = new Date(year, monthNum, 1, 0, 0, 0, 0);
  const endOfMonth = new Date(startOfNextMonth.getTime() - 1);

  // Find all orders for this user in the given month
  const orders = await this.orderModel.find({
    createdBy: userId,
    createdAt: { $gte: startOfMonth, $lte: endOfMonth },
  });
  const totalOrders = orders.length;
  const totalAmount = orders.reduce((sum, order) => {
    return sum + (order.totalAmount || 0);
  }, 0);

  return { totalOrders, totalAmount };
}

async getTopMedicinesByMonth(month: string): Promise<
  {
    name: string;
    quantity: number;
    price: number;
    manufacturer?: string;
    dosage?: string;
    packSize?: number;
  }[]
> {
  const [year, monthStr] = month.split('-').map(Number);
  const monthNum = monthStr - 1;

  const startDate = new Date(year, monthNum, 1);
  const endDate = new Date(year, monthNum + 1, 1);

  const orders = await this.orderModel.find({
    createdAt: { $gte: startDate, $lt: endDate },
  }).populate({
    path: 'orderDetails',
    populate: {
      path: 'medicine',
      select: 'name price manufacturer dosage packSize',
    },
  });

  const medicineMap = new Map<
    string,
    {
      name: string;
      quantity: number;
      price: number;
      manufacturer?: string;
      dosage?: string;
      packSize?: number;
    }
  >();

  for (const order of orders) {
    for (const detail of order.orderDetails as any[]) {
      const med = detail.medicine;
      const qty = detail.quantity || 0;

      if (med?.name) {
        if (!medicineMap.has(med.name)) {
          medicineMap.set(med.name, {
            name: med.name,
            quantity: qty,
            price: med.price,
            manufacturer: med.manufacturer,
            dosage: med.dosage,
            packSize: med.packSize,
          });
        } else {
          medicineMap.get(med.name)!.quantity += qty;
        }
      }
    }
  }

  return Array.from(medicineMap.values()).sort((a, b) => b.quantity - a.quantity);
}


}
