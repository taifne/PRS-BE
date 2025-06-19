import { Types } from 'mongoose';
import { auditContext } from './audit-context';

export function currentUserId(): Types.ObjectId | undefined {
  const id = auditContext.get()?.userId;
  return id ? new Types.ObjectId(id) : undefined;
}

export function currentUsername(): string | undefined {
  return auditContext.get()?.username;
}

export function currentIp(): string | undefined {
  return auditContext.get()?.ip;
}
