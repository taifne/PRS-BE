// common/dto/api-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseDto<TData> {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Request processed successfully' })
  message: string;

  // For Swagger we can't directly use generic, so we’ll extend this later
  data: TData;
}
