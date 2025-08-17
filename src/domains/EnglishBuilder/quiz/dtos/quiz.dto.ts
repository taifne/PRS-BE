import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsIn, IsInt, IsOptional, IsString, Min, Max } from 'class-validator';

export class GenerateQuizDto {
  @ApiPropertyOptional({ type: [String], description: 'Filter by topics' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  topics?: string[];

  @ApiPropertyOptional({
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    description: 'Filter by difficulty level',
  })
  @IsOptional()
  @IsIn(['Beginner', 'Intermediate', 'Advanced'])
  level?: string;

  @ApiProperty({ minimum: 1, maximum: 20, description: 'Number of questions to generate' })
  @IsInt()
  @Min(1)
  @Max(20)
  numQuestions: number;
}

export type QuestionType =
  | 'definition_mcq'
  | 'word_mcq'
  | 'fill_blank'
  | 'synonym_mcq'
  | 'antonym_mcq'
  | 'example_fill';

export class QuizQuestionDto {
  @ApiProperty({ description: 'Vocabulary word' })
  word: string;

  @ApiProperty({ description: 'Question text' })
  question: string;

  @ApiProperty({ enum: [
    'definition_mcq',
    'word_mcq',
    'fill_blank',
    'synonym_mcq',
    'antonym_mcq',
    'example_fill',
  ]})
  type: QuestionType;

  @ApiPropertyOptional({ description: 'Multiple choice options' })
  options?: string[];

  @ApiProperty({ description: 'Correct answer' })
  answer: string;

  @ApiPropertyOptional({ description: 'Sentence for fill-in-the-blank' })
  sentence?: string;
}

export class GenerateSentenceQuizDto {
  @ApiProperty({ required: false, description: 'Filter by topics', example: ['Food', 'Basic'] })
  topics?: string[];

  @ApiProperty({ required: false, description: 'Difficulty level', example: 'Beginner' })
  level?: string;

  @ApiProperty({ required: false, description: 'Number of questions', example: 5 })
  numQuestions?: number;
}

export class SentenceQuizQuestionDto {
  @ApiProperty({ description: 'Sentence with missing words replaced by blanks' })
  maskedSentence: string;

  @ApiProperty({ description: 'Array of missing words (correct answers)' })
  missingWords: string[];

  @ApiProperty({ description: 'Full original sentence' })
  fullSentence: string;
}