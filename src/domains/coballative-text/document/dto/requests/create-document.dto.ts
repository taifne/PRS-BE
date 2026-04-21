import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsOptional, IsMongoId, IsArray, IsIn } from "class-validator";
import { Types } from "mongoose";

export class CreateDocumentDto {
    @ApiProperty({ description: 'Document title' })
    @IsNotEmpty()
    @IsString()
    title: string;

    @ApiProperty({
        description: 'Document content',
        required: false,
        default: ''
    })
    @IsOptional()
    @IsString()
    content?: string;

    @ApiProperty({ description: 'Owner user ID' })
    @IsNotEmpty()
    @IsMongoId()
    ownerId: Types.ObjectId;

    @ApiProperty({
        description: 'Collaborator user IDs',
        type: [String],
        required: false
    })
    @IsOptional()
    @IsArray()
    @IsMongoId({ each: true })
    collaborators?: Types.ObjectId[];

    @ApiProperty({
        description: 'Viewer user IDs',
        type: [String],
        required: false
    })
    @IsOptional()
    @IsArray()
    @IsMongoId({ each: true })
    viewers?: Types.ObjectId[];

    @ApiProperty({
        description: '"public" or "private"',
        required: false,
        default: 'private'
    })
    @IsOptional()
    @IsString()
    @IsIn(['public', 'private'])
    privacy?: string;

    @ApiProperty({
        description: 'Document type/category ID',
        required: false
    })
    @IsOptional()
    @IsMongoId()
    documentTypeId?: Types.ObjectId;
}