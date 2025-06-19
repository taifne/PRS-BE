import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, from } from 'rxjs';
import { auditContext } from './audit-context';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const user = req.user;

    const ctx = {
      userId: user?._id || user?.id,
      username: user?.username,
      ip: req.ip,
      headers: req.headers,
    };
    return from(
      new Promise((resolve) => {
        auditContext.run(ctx, () => {
          resolve(next.handle().toPromise());
        });
      }).then((res) => res),
    );
  }
}
