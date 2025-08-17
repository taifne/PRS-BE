import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateMedicineDto, UpdateMedicineDto } from './dto/create-supplier.dto';
import { Medicine, MedicineDocument } from './medidines.schema';

@Injectable()
export class MedicineService {
  constructor(@InjectModel(Medicine.name) private medicineModel: Model<MedicineDocument>) {}

  async create(createMedicineDto: CreateMedicineDto): Promise<Medicine> {
    const newMedicine = new this.medicineModel(createMedicineDto);
    return newMedicine.save();
  }

  async findAll(): Promise<Medicine[]> {
    return this.medicineModel.find().populate('supplier').exec();
  }

  async findOne(id: string): Promise<Medicine> {
    return this.medicineModel.findById(id).populate('supplier').exec();
  }

  async update(id: string, updateMedicineDto: UpdateMedicineDto): Promise<Medicine> {
    console.log(id,"hehe");
    return this.medicineModel.findByIdAndUpdate(id, updateMedicineDto, { new: true }).exec();
  }

  // async remove(id: string): Promise<Medicine> {
  //   return this.medicineModel.findByIdAndRemove(id).exec();
  // }
  async searchMedicines(filters: Record<string, string>): Promise<Medicine[]> {
    const query: any = {};
    
    for (const key in filters) {
      if (filters[key]) {
        query[key] = new RegExp(filters[key], 'i'); // Case-insensitive regex search
      }
    }
    
    return this.medicineModel.find(query).populate('supplier').exec();
  }
  async deleteManyByIds(ids: string[]): Promise<{ deletedCount: number }> {
  const result = await this.medicineModel.deleteMany({ _id: { $in: ids } });

  return { deletedCount: result.deletedCount ?? 0 };
}

}
