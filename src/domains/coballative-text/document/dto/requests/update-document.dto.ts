import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsArray } from 'class-validator';
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
    collaborators?: Types.ObjectId[] | string[];
}