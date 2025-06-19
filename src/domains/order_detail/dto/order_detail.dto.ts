// src/orders/dto/create-order-detail.dto.ts
import { IsMongoId, IsNumber, IsString } from 'class-validator';

export class CreateOrderDetailDto {

  @IsString()
  orderKey:string;
  @IsMongoId()
  medicine: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  unitPrice: number;

  @IsNumber()
  totalPrice: number;
}
