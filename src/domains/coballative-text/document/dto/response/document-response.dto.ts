import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import { Types } from 'mongoose';

export class CollaboratorResponseDto {
    @ApiProperty({ description: 'User ID' })
    @Expose({ name: '_id' })
    @Transform(({ obj }) => obj._id?.toString(), { toClassOnly: true })
    id: string;

    @ApiProperty({ description: 'Username' })
    @Expose()
    username: string;

    @ApiProperty({ description: 'Display name' })
    @Expose()
    displayName: string;

    @ApiProperty({ description: 'Email address' })
    @Expose()
    email: string;
}
export class DocumentResponseDto {
    @ApiProperty({ description: 'Document ID' })
    @Expose({ name: '_id' })
    @Transform(({ obj }) => obj._id?.toString(), { toClassOnly: true })
    id: string;

    @ApiProperty({ description: 'Document title' })
    @Expose()
    title: string;

    @ApiProperty({ description: 'Document content' })
    @Expose()
    content: string;

    @ApiProperty({ description: 'Owner user ID' })
    @Expose()
    @Transform(({ obj }) => obj.ownerId?.toString(), { toClassOnly: true })
    ownerId: string;

    @ApiProperty({ description: 'List of collaborators', type: [CollaboratorResponseDto] })
    @Expose()
    @Type(() => CollaboratorResponseDto)
    collaborators: CollaboratorResponseDto[];

    @ApiProperty({ description: 'Soft delete flag' })
    @Expose()
    isDeleted: boolean;

    @ApiProperty({ description: 'Created at timestamp' })
    @Expose()
    createdAt: Date;

    @ApiProperty({ description: 'Updated at timestamp' })
    @Expose()
    updatedAt: Date;
}