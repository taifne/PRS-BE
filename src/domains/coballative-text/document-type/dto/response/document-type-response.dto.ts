import { ApiProperty } from "@nestjs/swagger";
import { Expose, Transform } from "class-transformer";

export class DocumentTypeResponseDto {
    @ApiProperty()
    @Expose({ name: '_id' })
    @Transform(({ obj }) => obj._id?.toString(), { toClassOnly: true })
    id: string;

    @ApiProperty()
    @Expose()
    name: string;

    @ApiProperty()
    @Expose()
    description: string;
}