import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

export class DocumentCursorResponseDto {
  @ApiProperty({ description: 'Document Cursor ID' })
  @Expose({ name: '_id' })
  @Transform(({ obj }) => obj._id?.toString(), { toClassOnly: true })
  id: string;

  @ApiProperty({ description: 'Document ID' })
  @Expose()
  @Transform(({ obj }) => obj.documentId?.toString(), {
    toClassOnly: true,
  })
  documentId: string;

  @ApiProperty({ description: 'User ID' })
  @Expose()
  @Transform(({ obj }) => obj.userId?.toString(), {
    toClassOnly: true,
  })
  userId: string;

  @ApiProperty({ description: 'Cursor position' })
  @Expose()
  cursorPosition: number;

  @ApiProperty({ description: 'Selection start position' })
  @Expose()
  selectionStart: number;

  @ApiProperty({ description: 'Selection end position' })
  @Expose()
  selectionEnd: number;

  @ApiProperty({ description: 'Created at' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ description: 'Updated at' })
  @Expose()
  updatedAt: Date;
}