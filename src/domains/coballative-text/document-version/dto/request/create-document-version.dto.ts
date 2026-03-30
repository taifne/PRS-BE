import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsArray, IsMongoId, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';

/**
 * Represents a single change entry in a document version
 */
export class ChangeEntryDto {
    @ApiProperty({ description: 'Position of the change in the document' })
    @IsNotEmpty()
    position: number;

    @ApiProperty({ description: 'Text inserted at this position', default: '' })
    @IsString()
    @IsOptional()
    insertedText?: string;

    @ApiProperty({ description: 'Text deleted at this position', default: '' })
    @IsString()
    @IsOptional()
    deletedText?: string;

    @ApiProperty({ description: 'Timestamp of this change', type: Date, required: false })
    @IsOptional()
    timestamp?: Date;
}

/**
 * DTO for creating a new document version
 */
export class CreateDocumentVersionDto {
    @ApiProperty({ description: 'Reference to the original document' })
    @IsNotEmpty()
    @IsMongoId()
    documentId: Types.ObjectId;

    @ApiProperty({ description: 'Editor user ID who created this version' })
    @IsNotEmpty()
    @IsMongoId()
    editorId: Types.ObjectId;

    @ApiProperty({ description: 'Full content snapshot of the document', default: '' })
    @IsString()
    content?: string;

    @ApiProperty({ description: 'List of changes in this version', type: [ChangeEntryDto], required: false })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ChangeEntryDto)
    changes?: ChangeEntryDto[];
}
