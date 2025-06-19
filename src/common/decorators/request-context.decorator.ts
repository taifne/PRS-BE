import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface RequestContext {
  user?: any;
  ip?: string;
  headers?: any;
  rawRequest?: any;
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
