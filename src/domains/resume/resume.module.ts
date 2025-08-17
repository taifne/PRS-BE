import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Resume, ResumeSchema } from './resume.schema';
import { ResumeController } from './resume.controller';
import { ResumeService } from './resume.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Resume.name, schema: ResumeSchema },
    ]),
  ],
  controllers: [ResumeController],
  providers: [ResumeService],
  exports: [ResumeService], // optional, if other modules need to use ResumeService
})
export class ResumeModule {}
