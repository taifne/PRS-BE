import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsOptional, IsMongoId, IsArray } from "class-validator";
import { Types } from "mongoose";

// Request DTO for creating a document
export class CreateDocumentDto {
    @ApiProperty({ description: 'Document title' })
    @IsNotEmpty()
    @IsString()
    title: string;

    @ApiProperty({ description: 'Document content', required: false, default: '' })
    @IsOptional()
    @IsString()
    content?: string;

    @ApiProperty({ description: 'Owner user ID' })
    @IsNotEmpty()
    @IsMongoId()
    ownerId: Types.ObjectId;

    @ApiProperty({ description: 'Collaborator user IDs', type: [String], required: false })
    @IsOptional()
    @IsArray()
    @IsMongoId({ each: true })
    collaborators?: Types.ObjectId[];
}