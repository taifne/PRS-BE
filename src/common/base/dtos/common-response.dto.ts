import { ApiProperty } from '@nestjs/swagger';

export class PaginationMetaDto {
  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  total: number;
}

export class CommonResponseDto<T> {
  @ApiProperty()
  success: boolean;

  @ApiProperty({ required: false })
  message?: string;

  @ApiProperty({ required: false })
  data?: T;

  @ApiProperty({ required: false })
  meta?: PaginationMetaDto;

  @ApiProperty({ required: false })
  error?: any;

  private constructor(partial: Partial<CommonResponseDto<T>>) {
    Object.assign(this, partial);
  }

  static ok<T>(data: T, message = 'Success', meta?: PaginationMetaDto) {
    return new CommonResponseDto<T>({ success: true, message, data, meta });
  }

  static fail<T>(message: string, error?: any) {
    return new CommonResponseDto<T>({ success: false, message, error });
  }
}
