import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsArray, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';


export class UpdateDocumentDto {
    @ApiPropertyOptional({ description: 'Document title' })
    @IsOptional()
    @IsString()
    title?: string;

    @ApiPropertyOptional({ description: 'Document content' })
    @IsOptional()
    @IsString()
    content?: string;

    @ApiPropertyOptional({ description: 'List of collaborator user IDs', type: [String] })
    @IsOptional()
    @IsArray()
    @IsMongoId({ each: true })
    collaborators?: string[];  // ✅ Keep as string[] for DTO validation

    @ApiPropertyOptional({ description: 'List of viewer user IDs', type: [String] })
    @IsOptional()
    @IsArray()
    @IsMongoId({ each: true })
    viewers?: string[];  // ✅ Add viewers field

    @ApiPropertyOptional({ description: 'Privacy setting', enum: ['public', 'private'] })
    @IsOptional()
    @IsString()
    privacy?: 'public' | 'private';

    @ApiPropertyOptional({ description: 'Document type ID' })
    @IsOptional()
    @IsMongoId()
    documentTypeId?: string;

    @ApiPropertyOptional({ description: 'Soft delete flag' })
    @IsOptional()
    isDeleted?: boolean;
}