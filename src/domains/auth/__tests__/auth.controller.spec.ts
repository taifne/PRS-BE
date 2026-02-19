import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { Messages } from 'src/common/message/messages';
import { CommonResponseDto } from 'src/common/dto/common-response.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get(AuthController);
    authService = module.get(AuthService);
  });

  // ------------------------
  // REGISTER
  // ------------------------
  describe('register', () => {
    it('should register user and return common response', async () => {
      const mockUser = {
        _id: 'user-id',
        username: 'testuser',
        email: 'test@example.com',
      };

      authService.register.mockResolvedValue(mockUser as any);

      const result = await controller.register({
        username: 'testuser',
        email: 'test@example.com',
        password: '123456',
      } as any);

      expect(authService.register).toHaveBeenCalledWith({
        username: 'testuser',
        email: 'test@example.com',
        password: '123456',
      });

      expect(result).toEqual(
        CommonResponseDto.ok(
          {
            id: 'user-id',
            username: 'testuser',
            email: 'test@example.com',
          },
          Messages.success.user.created('testuser'),
        ),
      );
    });
  });

  // ------------------------
  // LOGIN
  // ------------------------
  describe('login', () => {
    it('should login user and return common response', async () => {
      const loginResponse = {
        accessToken: 'jwt-token',
        tokenType: 'Bearer',
        expiresIn: 3600,
        user: {
          id: 'user-id',
          email: 'test@example.com',
          userName: 'testuser',
          role: 'ADMIN',
        },
      };

      authService.login.mockResolvedValue(loginResponse as any);

      const result = await controller.login({
        email: 'test@example.com',
        password: '123456',
      } as any);

      expect(authService.login).toHaveBeenCalled();

      expect(result).toEqual(
        CommonResponseDto.ok(
          loginResponse,
          Messages.success.auth.loggedIn('test@example.com'),
        ),
      );
    });
  });

  // ------------------------
  // PROFILE
  // ------------------------
  describe('getProfile', () => {
    it('should return current user profile', () => {
      const req = {
        user: {
          _id: 'user-id',
          username: 'testuser',
          email: 'test@example.com',
          role: { name: 'ADMIN' },
        },
      };

      const result = controller.getProfile(req);

      expect(result).toEqual(
        CommonResponseDto.ok(
          {
            id: 'user-id',
            username: 'testuser',
            email: 'test@example.com',
            role: 'ADMIN',
          },
          Messages.success.user.fetched('testuser'),
        ),
      );
    });
  });
});
