import { IsNotEmpty, IsString, IsOptional, IsEmail, IsBoolean, IsDateString } from "class-validator";

export class CreateSupplierDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsOptional()
  @IsString()
  readonly contactInfo?: string;

  @IsOptional()
  @IsString()
  readonly address?: string;

  @IsOptional()
  @IsEmail()
  readonly email?: string;

  @IsOptional()
  @IsString()
  readonly taxId?: string;

  @IsOptional()
  @IsString()
  readonly country?: string;

  @IsOptional()
  @IsString()
  readonly paymentTerms?: string;

  @IsOptional()
  @IsBoolean()
  readonly isActive?: boolean;

  @IsOptional()
  @IsString()
  readonly phoneNumber?: string;

  @IsOptional()
  @IsString()
  readonly representativeName?: string;

  @IsOptional()
  @IsDateString()
  readonly contractStartDate?: string;
}

export class UpdateSupplierDto {
  @IsOptional()
  @IsString()
  readonly name?: string;

  @IsOptional()
  @IsString()
  readonly contactInfo?: string;

  @IsOptional()
  @IsString()
  readonly address?: string;

  @IsOptional()
  @IsEmail()
  readonly email?: string;

  @IsOptional()
  @IsString()
  readonly taxId?: string;

  @IsOptional()
  @IsString()
  readonly country?: string;

  @IsOptional()
  @IsString()
  readonly paymentTerms?: string;

  @IsOptional()
  @IsBoolean()
  readonly isActive?: boolean;

  @IsOptional()
  @IsString()
  readonly phoneNumber?: string;

  @IsOptional()
  @IsString()
  readonly representativeName?: string;

  @IsOptional()
  @IsDateString()
  readonly contractStartDate?: string;
}
