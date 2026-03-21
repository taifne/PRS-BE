import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SupplierDocument = Supplier & Document;

@Schema({ timestamps: true })
export class Supplier {
  @Prop({ required: true })
  name: string;

  @Prop()
  contactInfo: string;

  @Prop()
  address: string;

  @Prop({ unique: true, sparse: true })
  email: string;

  @Prop()
  taxId: string;

  @Prop()
  country: string;

  @Prop()
  paymentTerms: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  phoneNumber: string;

  @Prop()
  representativeName: string;

  @Prop({ type: Date })
  contractStartDate: Date;
}

export const SupplierSchema = SchemaFactory.createForClass(Supplier);
