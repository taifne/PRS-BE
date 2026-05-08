import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsArray, IsMongoId, IsNotEmpty } from 'class-validator';

export class CreateDocumentDto {
    @ApiProperty({ description: 'Document title' })
    @IsNotEmpty()
    @IsString()
    title: string;

    @ApiPropertyOptional({ description: 'Document content' })
    @IsOptional()
    @IsString()
    content?: string;

    @ApiProperty({ description: 'Owner user ID' })
    @IsNotEmpty()
    @IsMongoId()
    ownerId: string;  // ✅ Keep as string for DTO

    @ApiPropertyOptional({ description: 'List of collaborator user IDs', type: [String] })
    @IsOptional()
    @IsArray()
    @IsMongoId({ each: true })
    collaborators?: string[];

    @ApiPropertyOptional({ description: 'List of viewer user IDs', type: [String] })
    @IsOptional()
    @IsArray()
    @IsMongoId({ each: true })
    viewers?: string[];

    @ApiPropertyOptional({ description: 'Privacy setting', enum: ['public', 'private'], default: 'private' })
    @IsOptional()
    @IsString()
    privacy?: 'public' | 'private';

    @ApiPropertyOptional({ description: 'Document type ID' })
    @IsOptional()
    @IsMongoId()
    documentTypeId?: string;
}