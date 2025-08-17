import { IsOptional, IsString, IsArray, IsIn, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchVocabularyDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  topics?: string; 

  @IsOptional()
  @IsIn(['Beginner', 'Intermediate', 'Advanced'])
  level?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;
}
