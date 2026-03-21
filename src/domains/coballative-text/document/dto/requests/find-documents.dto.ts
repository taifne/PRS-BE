import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class FindDocumentsDto {
    @ApiProperty({ description: 'Owner user ID' })
    @IsString()
    ownerId: string;
}