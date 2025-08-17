import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User, UserSchema } from './user.schema';
import { PunchService } from '../user copy/punch.service';
import { Punch, PunchSchema } from '../user copy/punch.schema';
import { Role, RoleSchema } from '../role/role.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Role.name, schema: RoleSchema },
      { name: Punch.name, schema: PunchSchema },
    ]),
  ],
  providers: [UserService, PunchService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}