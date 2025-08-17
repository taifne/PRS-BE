import { IsString, IsOptional, IsMongoId, IsBoolean, IsEnum } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateMenuDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly label: string;

  @IsOptional()
  @IsString()
  readonly description?: string;

  @IsOptional()
  @IsString()
  readonly icon?: string;

  @IsOptional()
  @IsString()
  readonly path?: string;

  @IsOptional()
  @IsString()
  readonly externalUrl?: string;

  @IsOptional()
  @IsEnum(['route', 'group', 'link', 'divider'])
  readonly type?: 'route' | 'group' | 'link' | 'divider';

  @IsOptional()
  @IsMongoId()
  readonly parent?: string;

  @IsOptional()
  @IsBoolean()
  readonly isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  readonly hidden?: boolean;
}

export class UpdateMenuDto extends PartialType(CreateMenuDto) {}
