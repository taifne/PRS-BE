import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { QuizController } from './quiz.controller';
import { QuizService } from './quiz.service';
import { Vocabulary, VocabularySchema } from 'src/domains/vocabulary/vocabulary.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Vocabulary.name, schema: VocabularySchema }])],
  controllers: [QuizController],
  providers: [QuizService],
})
export class QuizModule {}
