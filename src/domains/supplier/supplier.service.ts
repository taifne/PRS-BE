import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CreateSupplierDto,
  UpdateSupplierDto,
} from './dto/create-supplier.dto';
import { Supplier, SupplierDocument } from './supplier.schema';

@Injectable()
export class SupplierService {
  constructor(
    @InjectModel(Supplier.name) private supplierModel: Model<SupplierDocument>,
  ) {}

  async create(createSupplierDto: CreateSupplierDto): Promise<Supplier> {
    const createdSupplier = new this.supplierModel(createSupplierDto);
    return createdSupplier.save();
  }

  async findAll(): Promise<Supplier[]> {
    return this.supplierModel.find().exec();
  }

  async findOne(id: string): Promise<Supplier> {
    return this.supplierModel.findById(id).exec();
  }

  async update(
    id: string,
    updateSupplierDto: UpdateSupplierDto,
  ): Promise<Supplier> {
    return this.supplierModel
      .findByIdAndUpdate(id, updateSupplierDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<{ success: boolean }> {
    const filter = { _id: id };

    const deleted = await this.supplierModel.deleteOne(filter);
    if (deleted.deletedCount > 0) return { success: true };
    else {
      return { success: false };
    }
  }
}
