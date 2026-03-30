import { IsMongoId } from 'class-validator';

export class GetDocumentCursorDto {
    @IsMongoId()
    documentId: string;

    @IsMongoId()
    userId: string;
}