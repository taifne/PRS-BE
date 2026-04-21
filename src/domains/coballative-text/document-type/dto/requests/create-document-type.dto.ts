import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsOptional } from "class-validator";

export class CreateDocumentTypeDto {
    @ApiProperty({ description: 'Document type name' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ description: 'Description', required: false })
    @IsOptional()
    @IsString()
    description?: string;
}