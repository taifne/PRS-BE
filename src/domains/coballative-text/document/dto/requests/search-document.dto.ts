import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsOptional,
  IsString,
  IsMongoId,
  IsEnum,
  IsNumber,
  Min,
} from "class-validator";
import { DocumentPrivacy } from "../../document.schema";

export class SearchDocumentDto {
  @ApiPropertyOptional({ description: "Search keyword (title + content)" })
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiPropertyOptional({ enum: DocumentPrivacy })
  @IsOptional()
  @IsEnum(DocumentPrivacy)
  privacy?: DocumentPrivacy;

  @ApiPropertyOptional({ description: "Filter by document type" })
  @IsOptional()
  @IsMongoId()
  documentTypeId?: string;

  @ApiPropertyOptional({ description: "Filter by collaborator userId" })
  @IsOptional()
  @IsMongoId()
  collaboratorId?: string;

  @ApiPropertyOptional({ description: "Filter by viewer userId" })
  @IsOptional()
  @IsMongoId()
  viewerId?: string;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({ default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit: number = 10;
}