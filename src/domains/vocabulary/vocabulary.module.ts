import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VocabularyService } from './vocabulary.service';
import { VocabularyController } from './vocabulary.controller';
import { Vocabulary, VocabularySchema } from './vocabulary.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Vocabulary.name, schema: VocabularySchema }]),
  ],
  controllers: [VocabularyController],
  providers: [VocabularyService],
  exports: [VocabularyService],
})
export class VocabularyModule {}
