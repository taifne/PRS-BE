import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MedicineController } from './medidines.controller';
import { Medicine, MedicineSchema } from './medidines.schema';
import { MedicineService } from './medidines.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Medicine.name, schema: MedicineSchema }]),
  ],
  controllers: [MedicineController],
  providers: [MedicineService],
})
export class MedicineModule {}
