import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UserService } from '../../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';

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

  describe('login()', () => {
    it('should return token and user info with roles', async () => {
      const mockUser = {
        _id: 'user-id',
        email: 'tai.dev@example.com',
        username: 'tai_dev',
        password: 'hashed-password',
        roles: ['role-id'],
      };

      jest.spyOn(userService, 'findByEmail').mockResolvedValue(mockUser as any);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
      jest.spyOn(userService, 'getRoleNamesByIds').mockResolvedValue(['ADMIN']);

      jest.spyOn(jwtService, 'sign').mockReturnValue('jwt-token');

      const result = await authService.login({
        email: mockUser.email,
        password: 'plain-password',
        rememberMe: true,
      });

      expect(result).toEqual({
        accessToken: 'jwt-token',
        tokenType: 'Bearer',
        expiresIn: 60 * 60 * 24 * 30,
        user: {
          id: 'user-id',
          email: mockUser.email,
          userName: mockUser.username,
          roles: ['ADMIN'],
        },
      });
    });

    it('should throw UnauthorizedException if credentials invalid', async () => {
      jest.spyOn(userService, 'findByEmail').mockResolvedValue(null);

      await expect(
        authService.login({
          email: 'wrong@example.com',
          password: 'wrong',
          rememberMe: false,
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
