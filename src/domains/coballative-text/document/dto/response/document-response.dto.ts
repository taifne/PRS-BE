import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';

export class CollaboratorResponseDto {
  @ApiProperty()
  @Expose()
  @Transform(({ obj }) => obj.id || obj._id?.toString())
  id: string;

  @ApiProperty()
  @Expose()
  username?: string;

  @ApiProperty()
  @Expose()
  displayName?: string;

  @ApiProperty()
  @Expose()
  email?: string;
}

export class DocumentResponseDto {
  @ApiProperty()
  @Expose({ name: '_id' })
  @Transform(({ obj }) => obj._id?.toString() || obj.id)
  id: string;

  @ApiProperty()
  @Expose()
  title: string;

  @ApiProperty()
  @Expose()
  content: string;

  @ApiProperty()
  @Expose()
  @Transform(({ obj }) => {
    if (obj.ownerId && typeof obj.ownerId === 'object') {
      return obj.ownerId._id?.toString() || obj.ownerId.id;
    }
    return obj.ownerId?.toString();
  })
  ownerId: string;

  @ApiProperty({ type: [CollaboratorResponseDto] })
  @Expose()
  @Type(() => CollaboratorResponseDto)
  collaborators: CollaboratorResponseDto[];

  @ApiProperty({ type: [String] })
  @Expose()
  @Transform(({ obj }) => {
    if (!obj.viewers) return [];
    return obj.viewers.map((v: any) => {
      if (typeof v === 'object') return v._id?.toString() || v.id;
      return v.toString();
    });
  })
  viewers: string[];

  @ApiProperty()
  @Expose()
  privacy: string;

  @ApiProperty()
  @Expose()
  @Transform(({ obj }) => obj.documentTypeId?.toString())
  documentTypeId?: string;

  @ApiProperty()
  @Expose()
  isDeleted: boolean;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;
}