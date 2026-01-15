// src/auth/interfaces/jwt-user.interface.ts
export interface JwtUser {
  sub: string;
  email: string;
  role: string;
  userName: string;
}
