// src/users/dto/search-user.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsMongoId } from 'class-validator';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

export class SearchUserDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    example: 'john',
    description: 'Filter by display name (partial match)',
  })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiPropertyOptional({
    example: 'john@example.com',
    description: 'Filter by email (partial match)',
  })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({
    example: 'Hanoi',
    description: 'Filter by address (partial match)',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({
    example: '+84901234567',
    description: 'Filter by phone (partial match)',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    example: '64e23f1c8d3b2a5f9a87c123',
    description: 'Filter by role ID (MongoDB ObjectId)',
  })
  @IsOptional()
  @IsMongoId()
  role?: string;
}
