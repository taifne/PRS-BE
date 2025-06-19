// src/auth/auth.controller.ts
import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  HttpCode,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/user.dto';
import { LoginDto } from './dto/login-request.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
  ApiOkResponse,
} from '@nestjs/swagger';
import { Messages } from 'src/common/message/messages';
import { Public } from 'src/common/decorators/public.decorator';
import { LoginResponseDto } from './dto/login-response.dto';
import { RegisterResponseDto } from './dto/register-response.dto';
import { UserProfileResponseDto } from '../user/dto/user-profile-response.dto';
import { CommonResponseDto } from 'src/common/base/dto/common-response.dto';
import { RefreshTokenDto } from './dto/refetch-token.dto';
import { ROUTES } from 'src/common/constants/routes.constant';

@ApiTags('Authentication')
@Controller('')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Public()
  @Post(ROUTES.ADMINISTRATION.AUTH.REGISTER)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'User created successfully.' })
  async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<CommonResponseDto<RegisterResponseDto>> {

    const user = await this.authService.register(createUserDto);

    return CommonResponseDto.ok(
      {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
      },
      Messages.success.user.created(user.username),
    );
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post(ROUTES.ADMINISTRATION.AUTH.LOGIN)
  @HttpCode(200)
  @ApiOperation({ summary: 'Login user' })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({
    description: 'User logged in successfully',
    type: LoginResponseDto,
  })
  async login(
    @Body() loginDto: LoginDto,
  ): Promise<CommonResponseDto<LoginResponseDto>> {
    const loginResponse = await this.authService.login(loginDto);

    return CommonResponseDto.ok(
      loginResponse,
      Messages.success.auth.loggedIn(loginDto.email),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get(ROUTES.ADMINISTRATION.AUTH.GETME)
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Current user profile fetched successfully',
    type: UserProfileResponseDto,
  })
  getProfile(@Request() req): CommonResponseDto<UserProfileResponseDto> {
    const user = req.user;

    return CommonResponseDto.ok(
      user,
      Messages.success.user.fetched(user.username),
    );
  }

  @Public()
  @Post(ROUTES.ADMINISTRATION.AUTH.REFRESH)
  @ApiOperation({ summary: 'Refresh access token using refresh token' })
  @ApiBody({ type: RefreshTokenDto })
  @ApiOkResponse({
    description: 'New access token issued successfully',
  })
  async refresh(@Body() body: RefreshTokenDto): Promise<CommonResponseDto<any>> {
    const { refreshToken } = body;

    const newToken = await this.authService.refreshToken(refreshToken);

    return CommonResponseDto.ok(
      newToken,
      Messages.success.auth.tokenRefreshed,
    );
  }
}
