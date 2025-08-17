import {
  IsString,
  IsOptional,
  IsEmail,
  MinLength,
  IsBoolean,
  IsDateString,
  IsMongoId,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'johndoe',
    description: 'Unique username for the user',
  })
  @IsString()
  username: string;

  @ApiProperty({
    example: 'securePass123',
    minLength: 6,
    description: 'Password for the user account',
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Email address of the user',
  })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({
    example: '64e23f1c8d3b2a5f9a87c123',
    description: 'Role ID reference (MongoDB ObjectId)',
  })
  @IsOptional()
  @IsString()
  role?: string;

  @ApiPropertyOptional({
    example: 'John Doe',
    description: 'Display name of the user',
  })
  @IsOptional()
  @IsString()
  displayName?: string;

  @ApiPropertyOptional({
    example: '2025-08-17',
    description: 'Start date of the user in ISO format',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({
    example: '+84901234567',
    description: 'Phone number of the user',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    example: '123 Main Street, Hanoi',
    description: 'Address of the user',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({
    example: '64e23f1c8d3b2a5f9a87c124',
    description: 'User ID who created this record',
  })
  @IsOptional()
  @IsMongoId()
  createdBy?: string;
}

export class UpdateUserDto {
  @ApiPropertyOptional({
    example: 'johndoe_updated',
    description: 'Updated username',
  })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiPropertyOptional({
    example: 'john.new@example.com',
    description: 'Updated email address',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    example: '64e23f1c8d3b2a5f9a87c125',
    description: 'Updated role ID',
  })
  @IsOptional()
  @IsString()
  role?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Indicates whether the user is active',
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    example: 'Johnny Doe',
    description: 'Updated display name',
  })
  @IsOptional()
  @IsString()
  displayName?: string;

  @ApiPropertyOptional({
    example: '2025-09-01',
    description: 'Updated start date in ISO format',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({
    example: '+84909876543',
    description: 'Updated phone number',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    example: '456 Elm Street, Da Nang',
    description: 'Updated address',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({
    example: '64e23f1c8d3b2a5f9a87c126',
    description: 'User ID who last updated this record',
  })
  @IsOptional()
  @IsMongoId()
  updatedBy?: string;
}

export class UpdateUserRoleDto {
  @ApiProperty({
    example: '64e23f1c8d3b2a5f9a87c127',
    description: 'New role ID for the user',
  })
  @IsMongoId()
   roleId: string;
}
