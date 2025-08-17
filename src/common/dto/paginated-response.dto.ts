// pagination.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Type } from '@nestjs/common';
class MetaDto {
  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  total: number;
}

export const PaginatedResponse = <TModel extends Type<any>>(model: TModel) => {
  class PaginatedResponseDto {
    @ApiProperty({ example: true })
    success: boolean;

    @ApiProperty({ example: 'Fetched successfully' })
    message: string;

    @ApiProperty({ type: MetaDto })
    meta: MetaDto;

    @ApiProperty({ type: [model] })
    items: InstanceType<TModel>[]; 
  }

  return PaginatedResponseDto;
};
