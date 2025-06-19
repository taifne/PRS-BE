
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Cat, CatSchema } from './cat.schema';
import { CatsController } from './cat.controller';
import { CatsService } from './cat.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Cat.name, schema: CatSchema }])],
  controllers: [CatsController],
  providers: [CatsService],
})
export class CatsModule {}
