import { AsyncLocalStorage } from 'node:async_hooks';

export interface AuditContextStore {
  userId?: string;  
  username?: string;
  ip?: string;
  headers?: Record<string, any>;
}

const als = new AsyncLocalStorage<AuditContextStore>();

export const auditContext = {
  run: (store: AuditContextStore, cb: (...args: any[]) => void) => als.run(store, cb),
  get: (): AuditContextStore | undefined => als.getStore(),
};
