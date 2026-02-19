import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { IS_PUBLIC_KEY } from 'src/common/decorators/public.decorator';
import { JwtAuthGuard } from '../jwt-auth.guard';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let reflector: Reflector;

  const mockReflector = {
    getAllAndOverride: jest.fn(),
  };

  const mockExecutionContext = (
    handler = jest.fn(),
    clazz = jest.fn(),
  ): ExecutionContext =>
    ({
      getHandler: () => handler,
      getClass: () => clazz,
    }) as unknown as ExecutionContext;

  beforeEach(() => {
    reflector = mockReflector as unknown as Reflector;
    guard = new JwtAuthGuard(reflector);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should allow access if route is public', () => {
    mockReflector.getAllAndOverride.mockReturnValue(true);

    const context = mockExecutionContext();

    const result = guard.canActivate(context);

    expect(result).toBe(true);
    expect(mockReflector.getAllAndOverride).toHaveBeenCalledWith(
      IS_PUBLIC_KEY,
      [context.getHandler(), context.getClass()],
    );
  });

  it('should call parent AuthGuard if route is NOT public', () => {
    mockReflector.getAllAndOverride.mockReturnValue(false);

    const context = mockExecutionContext();

    const superCanActivateSpy = jest
      .spyOn(Object.getPrototypeOf(JwtAuthGuard.prototype), 'canActivate')
      .mockReturnValue(true);

    const result = guard.canActivate(context);

    expect(superCanActivateSpy).toHaveBeenCalledWith(context);
    expect(result).toBe(true);

    superCanActivateSpy.mockRestore();
  });
});
