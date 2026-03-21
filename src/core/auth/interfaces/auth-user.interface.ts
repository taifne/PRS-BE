import { Types } from 'mongoose';

export interface AuthRole {
  _id: Types.ObjectId;
  name: string;
}

export interface AuthUser {
  _id: Types.ObjectId;
  email: string;
  username: string;
  roles: AuthRole[];
}
