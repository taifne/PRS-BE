// src/auth/constants/roles.constant.ts
export const RolesList = {
  ADMIN: 'admin',
  USER: 'user',
  MANAGER: 'manager',
} as const;

export type RoleType = typeof RolesList[keyof typeof RolesList];
