import { ApiProperty } from '@nestjs/swagger';
export class RegisterResponseDto {
  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  id: string;
}
