// src/roles/dto/update-menus.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ArrayNotEmpty, IsMongoId } from 'class-validator';

export class UpdateRoleMenusDto {
  @ApiProperty({ type: [String], description: 'Array of menu IDs' })
  @IsArray()
  @ArrayNotEmpty()
  @IsMongoId({ each: true })
  menuIds: string[];
}
