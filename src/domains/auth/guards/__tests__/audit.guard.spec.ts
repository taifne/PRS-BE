import { ExecutionContext } from '@nestjs/common';
import { AuditGuard } from '../audit.guard';
import { auditContext } from 'src/common/audit/audit-context';

describe('AuditGuard', () => {
  let guard: AuditGuard;

  const mockAuditRun = jest.spyOn(auditContext, 'run');

  const mockExecutionContext = (req: any): ExecutionContext =>
    ({
      switchToHttp: () => ({
        getRequest: () => req,
      }),
    }) as unknown as ExecutionContext;

  beforeEach(() => {
    guard = new AuditGuard();
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should set audit context when user exists', () => {
    const req = {
      user: {
        _id: 'user-id-123',
        username: 'john',
      },
      ip: '127.0.0.1',
      headers: { authorization: 'Bearer token' },
    };

    const context = mockExecutionContext(req);

    const result = guard.canActivate(context);

    expect(result).toBe(true);
    expect(mockAuditRun).toHaveBeenCalledWith(
      {
        userId: 'user-id-123',
        username: 'john',
        ip: '127.0.0.1',
        headers: { authorization: 'Bearer token' },
      },
      expect.any(Function),
    );
  });

  it('should handle request without user', () => {
    const req = {
      ip: '127.0.0.1',
      headers: {},
    };

    const context = mockExecutionContext(req);

    const result = guard.canActivate(context);

    expect(result).toBe(true);
    expect(mockAuditRun).toHaveBeenCalledWith(
      {
        userId: undefined,
        username: undefined,
        ip: '127.0.0.1',
        headers: {},
      },
      expect.any(Function),
    );
  });
});
