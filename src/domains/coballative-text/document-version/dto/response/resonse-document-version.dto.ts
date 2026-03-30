import { ApiProperty } from "@nestjs/swagger";
import { ChangeEntryDto } from "../request/create-document-version.dto";
import { Expose, Transform } from "class-transformer";

/**
 * Response DTO for a document version
 */
export class DocumentVersionResponseDto {
    @ApiProperty({ description: 'Document Version ID' })
    @Expose({ name: '_id' })
    @Transform(({ obj }) => obj._id?.toString(), { toClassOnly: true })
    id: string;

    @ApiProperty({ description: 'Reference to the original document' })
    documentId: string;

    @ApiProperty({ description: 'Version number' })
    versionNumber: number;

    @ApiProperty({ description: 'Editor user ID who created this version' })
    editorId: string;

    @ApiProperty({ description: 'Full content snapshot of the document', default: '' })
    content: string;

    @ApiProperty({ description: 'List of changes in this version', type: [ChangeEntryDto] })
    changes: ChangeEntryDto[];

    @ApiProperty({ description: 'Created at timestamp', type: Date })
    createdAt: Date;

    @ApiProperty({ description: 'Updated at timestamp', type: Date })
    updatedAt: Date;
}