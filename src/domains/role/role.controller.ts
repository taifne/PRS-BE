// src/roles/role.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { AddMenuToRoleDto, CreateRoleDto } from './dto/role.dto';
import { Role } from './role.schema';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  async create(@Body() createRoleDto: CreateRoleDto): Promise<Role> {
    return this.roleService.create(createRoleDto);
  }

  @Get()
  async findAll(): Promise<Role[]> {
    return this.roleService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Role> {
    return this.roleService.findById(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.roleService.remove(id);
  }
  // inside RoleController
  @Patch(':id/menus')
  async updateMenusInRole(
    @Param('id') roleId: string,
    @Body() dto: { menuIds: string[] }
  ) {
    return this.roleService.updateMenuInRole(roleId, dto.menuIds);
  }
  
}
