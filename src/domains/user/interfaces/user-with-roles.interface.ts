import { Types } from 'mongoose';

export interface UserWithRoles {
  _id: Types.ObjectId;
  email: string;
  username: string;
  password: string;
  roles: {
    _id: Types.ObjectId;
    name: string;
  }[];
}
