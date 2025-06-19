// src/categories/dto/create-category.dto.ts
import { IsString, IsOptional } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  readonly name: string;

  @IsOptional()
  @IsString()
  readonly description?: string;
}
