import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';

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

    @ApiProperty({
        description: 'List of collaborators',
        type: [CollaboratorResponseDto],
    })
    @Expose()
    @Type(() => CollaboratorResponseDto)
    collaborators: CollaboratorResponseDto[];

    // ✅ NEW: viewers (can be IDs or populated users)
    @ApiProperty({
        description: 'List of viewer user IDs',
        type: [String],
    })
    @Expose()
    @Transform(
        ({ obj }) =>
            obj.viewers?.map((v) =>
                typeof v === 'object' ? v._id?.toString() : v?.toString(),
            ),
        { toClassOnly: true },
    )
    viewers: string[];

    // ✅ NEW: privacy
    @ApiProperty({
        description: 'Privacy setting',
        enum: ['public', 'private'],
    })
    @Expose()
    privacy: string;

    // ✅ NEW: documentTypeId
    @ApiProperty({ description: 'Document type/category ID', required: false })
    @Expose()
    @Transform(({ obj }) => obj.documentTypeId?.toString(), {
        toClassOnly: true,
    })
    documentTypeId?: string;

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