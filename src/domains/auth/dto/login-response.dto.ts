// auth/dto/login-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({
    description: 'User unique identifier',
    example: '64f1c2e8a12c9d001234abcd',
  })
  id: string;

  @ApiProperty({
    description: 'User email',
    example: 'user@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Username / display name',
    example: 'john.doe',
  })
  userName: string;

  @ApiProperty({
    description: 'User role',
    example: 'ADMIN',
  })
  role: string;
}

export class LoginResponseDto {
  @ApiProperty({
    description: 'JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @ApiProperty({
    description: 'Token type',
    example: 'Bearer',
    default: 'Bearer',
  })
  tokenType: 'Bearer';

  @ApiProperty({
    description: 'Token expiration time in seconds',
    example: 3600,
  })
  expiresIn: number;

  @ApiProperty({
    description: 'Authenticated user info',
    type: LoginUserDto,
  })
  user: LoginUserDto;
}
