// src/roles/dto/response/role-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class RoleResponseDto {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty({ required: false })
  description?: string;

  @Expose()
  @ApiProperty({ type: [String], description: 'Array of menu IDs' })
  menus: string[];

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
