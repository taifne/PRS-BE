import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
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
  ) { }


  /**
    * Validate user credentials
    * @param email User email
    * @param password Plain text password
    * @returns user info if valid, throws otherwise
    */
  async validateUser(email: string, password: string): Promise<{
    _id: string;
    email: string;
    username: string;
    roles: any[];
  }> {
    // Find user by email and populate roles
    const user = await this.userService.findOneByOrThrow<UserDocument>(
      { email },
      {
        lean: true, // return plain object (faster)
        populate: { path: 'roles', select: 'name' }, // populate roles
        message: 'User not found',
      },
    );

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid credentials');
    }

    // Return cleaned user object (without password)
    const { _id, username, roles } = user;
    return {
      _id: _id.toString(),
      email,
      username,
      roles,
    };
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
        ? await this.userService.getRoleNamesByIds(user.roles)
        : user.roles;

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

    const refreshTokenExpires = rememberMe
      ? 60 * 60 * 24 * 30 // 30 days
      : 60 * 60 * 24 * 7; // 7 days

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: refreshTokenExpires,
      secret: process.env.JWT_REFRESH_SECRET || "set_later",
    });
    return {
      accessToken,
      tokenType: 'Bearer',
      expiresIn,
      refreshToken,
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
    const usernameExists = await this.userService.exists({
      username: registerDto.username,
      email: registerDto.email
    });

    if (usernameExists) {
      throw new BadRequestException('Username already exists !!');
    }
    return this.userService.create({
      ...registerDto,
      password: hashedPassword,
    });
  }
  async refreshToken(refreshToken: string): Promise<{ accessToken: string; expiresIn: number }> {
    try {
      const payload = this.jwtService.verify(refreshToken);

      // Optional: check hashed refresh token in DB for extra security
      const user = await this.userService.findOneByOrThrow(
        { _id: payload.sub },
        { lean: true },
      );

      const newAccessToken = this.jwtService.sign(
        {
          sub: user._id.toString(),
          email: user.email,
          role: payload.role,
          userName: user.username,
        },
        { expiresIn: 60 * 60 }, // 1 hour
      );

      return { accessToken: newAccessToken, expiresIn: 60 * 60 };
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}
