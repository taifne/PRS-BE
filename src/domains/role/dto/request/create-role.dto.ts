import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({ description: 'Name of the role', example: 'Admin' })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiPropertyOptional({ description: 'Description of the role', example: 'Administrator with full access' })
  @IsString()
  @IsOptional()
  readonly description?: string;
}
