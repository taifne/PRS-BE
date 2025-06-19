// src/roles/dto/create-role.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  readonly description?: string;
}
// src/roles/dto/add-menu-to-role.dto.ts
import { IsMongoId } from 'class-validator';

export class AddMenuToRoleDto {
  @IsMongoId()
  readonly menuId: string;
}
