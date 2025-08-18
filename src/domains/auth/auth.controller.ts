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
import { LoginDto } from './dtos/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

import { ApiTags, ApiOperation, ApiBody, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Messages } from 'src/common/message/messages';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'User created successfully.' })
  async register(@Body() createUserDto: CreateUserDto) {
    const user = await this.authService.register(createUserDto);
    return {
      data: user,
      message: Messages.success.user.created(user.username),
    };
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Login user' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'User logged in successfully.' })
  async login(@Body() loginDto: LoginDto) {
    const token = await this.authService.login(loginDto);
    return {
      data: token,
      message: Messages.success.auth.loggedIn(loginDto.email),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Current user profile fetched successfully.' })
  getProfile(@Request() req) {
    return {
      data: req.user,
      message: Messages.success.user.fetched(req.user.username),
    };
  }
}
