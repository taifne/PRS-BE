// src/common/filters/all-exceptions.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { CommonResponseDto } from '../dto/common-response.dto';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error: any = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();

      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object') {
        // NestJS usually puts `message` inside response body (can be string | string[])
        message = (res as any).message || message;
        error = (res as any).error || null;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      error = process.env.NODE_ENV === 'production' ? undefined : exception.stack;
    }

    const responseBody: CommonResponseDto<any> = {
      success: false,
      data: null,
      message,
      error,
    };

    response.status(status).json(responseBody);
  }
}
