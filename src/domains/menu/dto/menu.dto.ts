// src/menus/dto/create-menu.dto.ts
import { IsString, IsOptional, IsMongoId, IsBoolean } from 'class-validator';

export class CreateMenuDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly label: string;

  @IsOptional()
  @IsString()
  readonly icon?: string;

  @IsOptional()
  @IsString()
  readonly path?: string;

  @IsOptional()
  @IsMongoId()
  readonly parent?: string;

  @IsOptional()
  @IsBoolean()
  readonly isActive?: boolean;
}
