import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface RequestContext {
  user?: any;       // current logged-in user
  ip?: string;      // client IP
  headers?: any;    // request headers
  rawRequest?: any; // original request if needed
}

export const RequestContext = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): RequestContext => {
    const req = ctx.switchToHttp().getRequest();
    return {
      user: req.user,
      ip: req.ip,
      headers: req.headers,
      rawRequest: req,
    };
  },
);
