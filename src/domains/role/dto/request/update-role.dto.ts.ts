
import { IsArray, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateRoleDto {
  @ApiPropertyOptional({ description: 'Updated name of the role', example: 'Manager' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: 'Updated description of the role', example: 'Manager with limited access' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'List of menu IDs associated with this role', type: [String], example: ['64e8f0f7c1b2e0a1b2c3d4e5'] })
  @IsArray()
  @IsOptional()
  menus?: string[];
}
