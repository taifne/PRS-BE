// src/punch/punch.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PunchService } from './punch.service';
import { PunchController } from './punch.controller';
import { Punch, PunchSchema } from './punch.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Punch.name, schema: PunchSchema }])],
  controllers: [PunchController],
  providers: [PunchService],
})
export class PunchModule {}
