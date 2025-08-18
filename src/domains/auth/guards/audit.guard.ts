import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { auditContext } from 'src/common/audit/audit-context';

@Injectable()
export class AuditGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    
    const ctx = {
      userId: user?._id || user?.id,
      username: user?.username,
      ip: req.ip,
      headers: req.headers,
    };

    auditContext.run(ctx, () => {}); 
    return true; 
  }
}
