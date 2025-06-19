import { Controller, Post, Body, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';

import { CreateUserDto } from '../user/dto/user.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LoginDto } from './dtos/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  // @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body()  req:LoginDto) {
    return this.authService.login(req);
  }

  // @UseGuards(JwtAuthGuard)
  // @Post('profile')
  // getProfile(@Request() req) {
  //   return req.user;
  // }
}