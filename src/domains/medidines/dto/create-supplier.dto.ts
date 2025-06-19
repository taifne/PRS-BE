import { IsNotEmpty, IsNumber, IsOptional, IsString, IsDateString, IsArray, IsBoolean } from 'class-validator';

export class CreateMedicineDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsOptional()
  @IsString()
  readonly manufacturer?: string;

  @IsOptional()
  @IsDateString()
  readonly expiryDate?: Date;

  @IsOptional()
  @IsString()
  readonly dosage?: string;

  @IsNotEmpty()
  @IsNumber()
  readonly price: number;

  @IsNotEmpty()
  @IsNumber()
  readonly quantityInStock: number;

  // Optional supplier as a nested object
  @IsOptional()
  readonly supplier?: string;

  // Additional fields
  @IsOptional()
  @IsString()
  readonly category?: string;

  @IsOptional()
  @IsString()
  readonly description?: string;

  @IsOptional()
  @IsString()
  readonly dosageForm?: string;

  @IsOptional()
  @IsNumber()
  readonly packSize?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  readonly sideEffects?: string[];

  @IsOptional()
  @IsBoolean()
  readonly prescriptionRequired?: boolean;
}

export class UpdateMedicineDto {
  @IsOptional()
  @IsString()
  readonly name?: string;

  @IsOptional()
  @IsString()
  readonly manufacturer?: string;

  @IsOptional()
  @IsDateString()
  readonly expiryDate?: Date;

  @IsOptional()
  @IsString()
  readonly dosage?: string;

  @IsOptional()
  @IsNumber()
  readonly price?: number;

  @IsOptional()
  @IsNumber()
  readonly quantityInStock?: number;

  @IsOptional()
  @IsString()
  readonly supplier?: string;
}
