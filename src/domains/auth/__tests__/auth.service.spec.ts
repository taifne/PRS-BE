import { Test, TestingModule } from '@nestjs/testing';

import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { AuthService } from '../auth.service';
import { UserService } from 'src/domains/user/user.service';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: jest.Mocked<UserService>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findByEmail: jest.fn(),
            getRoleNamesByIds: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get(AuthService);
    userService = module.get(UserService);
    jwtService = module.get(JwtService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // -------------------------------
  // validateUser
  // -------------------------------
  describe('validateUser', () => {
    it('should return user info if credentials are valid', async () => {
      const hashedPassword = await bcrypt.hash('123456', 10);

      userService.findByEmail.mockResolvedValue({
        _id: 'user-id',
        email: 'test@example.com',
        username: 'testuser',
        password: hashedPassword,
        roles: ['role-id'],
      } as any);

      const result = await authService.validateUser(
        'test@example.com',
        '123456',
      );

      expect(result).toEqual({
        _id: 'user-id',
        email: 'test@example.com',
        username: 'testuser',
        roles: ['role-id'],
      });
    });

    it('should return null if password is incorrect', async () => {
      userService.findByEmail.mockResolvedValue({
        password: await bcrypt.hash('correct', 10),
      } as any);

      const result = await authService.validateUser(
        'test@example.com',
        'wrong',
      );

      expect(result).toBeNull();
    });

    it('should return null if user not found', async () => {
      userService.findByEmail.mockResolvedValue(null);

      const result = await authService.validateUser(
        'test@example.com',
        '123456',
      );

      expect(result).toBeNull();
    });
  });

  // -------------------------------
  // login
  // -------------------------------
  describe('login', () => {
    it('should login successfully and return token', async () => {
      jest.spyOn(authService, 'validateUser').mockResolvedValue({
        _id: 'user-id',
        email: 'test@example.com',
        username: 'testuser',
        roles: { name: 'ADMIN' },
      });

      jwtService.sign.mockReturnValue('jwt-token');

      const result = await authService.login({
        email: 'test@example.com',
        password: '123456',
        rememberMe: false,
      });

      expect(jwtService.sign).toHaveBeenCalled();
      expect(result).toEqual({
        accessToken: 'jwt-token',
        tokenType: 'Bearer',
        expiresIn: 3600,
        user: {
          id: 'user-id',
          email: 'test@example.com',
          userName: 'testuser',
          role: 'ADMIN',
        },
      });
    });

    it('should throw UnauthorizedException if credentials are invalid', async () => {
      jest.spyOn(authService, 'validateUser').mockResolvedValue(null);

      await expect(
        authService.login({
          email: 'test@example.com',
          password: 'wrong',
          rememberMe: false,
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  // -------------------------------
  // register
  // -------------------------------
  describe('register', () => {
    it('should hash password and create user', async () => {
      userService.create.mockResolvedValue({ _id: 'user-id' } as any);

      const spy = jest.spyOn(bcrypt, 'hash');

      const result = await authService.register({
        email: 'test@example.com',
        username: 'testuser',
        password: '123456',
      } as any);

      expect(spy).toHaveBeenCalled();
      expect(userService.create).toHaveBeenCalled();
      expect(result).toEqual({ _id: 'user-id' });
    });
  });
});
