import { IsMongoId, IsNumber, Min } from 'class-validator';

export class CreateDocumentCursorDto {
    @IsMongoId()
    documentId: string;

    @IsMongoId()
    userId: string;

    @IsNumber()
    @Min(0)
    cursorPosition: number;

    @IsNumber()
    @Min(0)
    selectionStart: number;

    @IsNumber()
    @Min(0)
    selectionEnd: number;
}