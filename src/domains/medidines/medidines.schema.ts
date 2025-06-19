import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Supplier } from '../supplier/supplier.schema';
import { Category } from '../category/category.schema';

export type MedicineDocument = Medicine & Document;

@Schema()
export class Medicine {
  @Prop({ required: true })
  name: string;

  @Prop()
  manufacturer: string;

  @Prop()
  expiryDate: Date;

  @Prop()
  dosage: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true, default: 0 })
  quantityInStock: number;

  @Prop({ type: Types.ObjectId, ref: Supplier.name })
  supplier: Supplier;

  // Additional Fields
  @Prop({ type: Types.ObjectId, ref: Category.name })
  category: Category;
  @Prop()
  description: string; // Detailed description of the medicine

  @Prop()
  dosageForm: string; // e.g., tablet, capsule, liquid, etc.

  @Prop({ default: 1 })
  packSize: number; // Number of units per package

  @Prop({ type: [String], default: [] })
  sideEffects: string[]; // List of common side effects

  @Prop({ default: false })
  prescriptionRequired: boolean; // Indicates if a prescription is needed
}

export const MedicineSchema = SchemaFactory.createForClass(Medicine);
