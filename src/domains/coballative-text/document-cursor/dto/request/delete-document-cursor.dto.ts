import { IsMongoId } from 'class-validator';

export class DeleteDocumentCursorDto {
    @IsMongoId()
    id: string;
}