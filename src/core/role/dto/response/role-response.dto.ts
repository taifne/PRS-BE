// src/roles/dto/response/role-response.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';

class MenuInRoleResponseDto {
  @Expose()
  @ApiProperty()
  @Transform(({ obj }) => obj._id?.toString())
  id: string;

  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty()
  label: string;

  @Expose()
  @ApiProperty({ required: false })
  description?: string;

  @Expose()
  @ApiProperty({ required: false })
  icon?: string;

  @Expose()
  @ApiProperty({ required: false })
  path?: string;

  @Expose()
  @ApiProperty({ required: false })
  externalUrl?: string;

  @Expose()
  @ApiProperty({
    enum: ['route', 'group', 'link', 'divider'],
    required: false,
  })
  type?: string;

  @Expose()
  @ApiProperty({ required: false, nullable: true })
  @Transform(({ value }) => (value ? value.toString() : null))
  parent?: string | null;

  @Expose()
  @ApiProperty({ required: false, example: 0 })
  order?: number;

  @Expose()
  @ApiProperty()
  isActive: boolean;

  @Expose()
  @ApiProperty()
  hidden: boolean;

  @Expose()
  @ApiProperty()
  createdAt: Date;

  @Expose()
  @ApiProperty()
  updatedAt: Date;
}

export class RoleResponseDto {
  @Expose()
  @ApiProperty()
  @Transform(({ obj }) => obj._id?.toString())
  id: string;

  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty({ required: false })
  description?: string;

  @Expose()
  @ApiProperty({
    type: [MenuInRoleResponseDto],
    description: 'Populated menus',
  })
  @Type(() => MenuInRoleResponseDto)
  menus: MenuInRoleResponseDto[];

  @Expose()
  @ApiProperty()
  isActive: boolean;

  @Expose()
  @ApiProperty()
  createdAt: Date;

  @Expose()
  @ApiProperty()
  updatedAt: Date;
}