import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, IsIn } from 'class-validator';

export class CreateVocabularyDto {
  @ApiProperty({
    description: 'The vocabulary word',
    example: 'apple',
  })
  @IsString()
  word: string;

  @ApiPropertyOptional({
    description: 'Part of speech, e.g. noun, verb',
    example: 'noun',
  })
  @IsOptional()
  @IsString()
  partOfSpeech?: string;

  @ApiPropertyOptional({
    description: 'List of definitions for the word',
    example: ['A fruit that grows on an apple tree.'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  definitions?: string[];

  @ApiPropertyOptional({
    description: 'Example sentences using the word',
    example: ['I ate an apple for breakfast.'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  examples?: string[];

  @ApiPropertyOptional({
    description: 'Synonyms of the word',
    example: ['fruit'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  synonyms?: string[];

  @ApiPropertyOptional({
    description: 'Antonyms of the word',
    example: ['orange'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  antonyms?: string[];

  @ApiPropertyOptional({
    description: 'Topics or categories for the word',
    example: ['Food', 'Basic'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  topics?: string[];

  @ApiPropertyOptional({
    description: 'Difficulty level of the word',
    example: 'Beginner',
    enum: ['Beginner', 'Intermediate', 'Advanced'],
  })
  @IsOptional()
  @IsIn(['Beginner', 'Intermediate', 'Advanced'])
  level?: string;
}
