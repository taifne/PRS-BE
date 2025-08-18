
import { IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddMenuToRoleDto {
  @ApiProperty({ description: 'ID of the menu to add', example: '64e8f0f7c1b2e0a1b2c3d4e5' })
  @IsMongoId()
  readonly menuId: string;
}