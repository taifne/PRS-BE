import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login-request.dto';
import { JwtUser } from './interfaces/jwt-user.interface';
import { LoginResponseDto } from './dto/login-response.dto';
import { RegisterDto } from './dto/register.dto';
import { UserDocument } from '../user/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { _id, email, roles, username } = user;
      return { _id: _id.toString(), email, roles, username };
    }

    return null;
  }

  async login({
    email,
    password,
    rememberMe,
  }: LoginDto): Promise<LoginResponseDto> {
    const user = await this.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const roleName =
      typeof user.roles === 'string'
        ? await this.userService.getRoleNamesByIds(user.role)
        : user.roles.name;

    const payload: JwtUser = {
      sub: user._id,
      email: user.email,
      role: roleName,
      userName: user.username,
    };

    const expiresIn = rememberMe
      ? 60 * 60 * 24 * 30 // 30 days
      : 60 * 60; // 1 hour

    const accessToken = this.jwtService.sign(payload, { expiresIn });

    return {
      accessToken,
      tokenType: 'Bearer',
      expiresIn,
      user: {
        id: user._id,
        email: user.email,
        userName: user.username,
        role: roleName,
      },
    };
  }

  async register(registerDto: RegisterDto): Promise<UserDocument> {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    return this.userService.create({
      ...registerDto,
      password: hashedPassword,
    });
  }
}
