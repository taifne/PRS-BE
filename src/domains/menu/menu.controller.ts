import { Controller, Post, Get, Param, Body, Delete, Patch } from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuDto, UpdateMenuDto } from './dto/menu.dto';

import { plainToInstance } from 'class-transformer';

import { ApiTags, ApiOperation, ApiCreatedResponse } from '@nestjs/swagger';
import { CommonResponseDto } from 'src/common/dto/common-response.dto';
import { Messages } from 'src/common/message/messages';
import { RolesList } from 'src/common/types/role';
import { Roles } from '../auth/decorators/roles.decorator';
import { MenuResponseDto } from './dto/responses/menu-response.dto';

@ApiTags('Menu')
@Controller('menus')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  @Roles(RolesList.ADMIN)
  @ApiOperation({ summary: 'Create a new menu (Admin only)' })
  @ApiCreatedResponse({ type: CommonResponseDto })
  async create(@Body() dto: CreateMenuDto): Promise<CommonResponseDto<MenuResponseDto>> {
    const menu = await this.menuService.create(dto);
    const response = plainToInstance(MenuResponseDto, menu, { excludeExtraneousValues: true });
    return CommonResponseDto.ok(response, Messages.success.menu.created(response.name));
  }

  @Get()
  @ApiOperation({ summary: 'Get all menus' })
  async findAll(): Promise<CommonResponseDto<MenuResponseDto[]>> {
    const menus = await this.menuService.findAll();
    const dto = plainToInstance(MenuResponseDto, menus, { excludeExtraneousValues: true });
    return CommonResponseDto.ok(dto, Messages.success.menu.listFetched(dto.length));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get menu by ID' })
  async findOne(@Param('id') id: string): Promise<CommonResponseDto<MenuResponseDto>> {
    const menu = await this.menuService.findOne(id);
    if (!menu) return CommonResponseDto.fail("not found");
    const dto = plainToInstance(MenuResponseDto, menu, { excludeExtraneousValues: true });
    return CommonResponseDto.ok(dto, Messages.success.menu.fetched(dto.name));
  }

  @Patch(':id')
  @Roles(RolesList.ADMIN)
  @ApiOperation({ summary: 'Update menu by ID (Admin only)' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateMenuDto,
  ): Promise<CommonResponseDto<MenuResponseDto>> {
    const updatedMenu = await this.menuService.update(id, dto);
    const response = plainToInstance(MenuResponseDto, updatedMenu, { excludeExtraneousValues: true });
    return CommonResponseDto.ok(response, Messages.success.menu.updated(response.name));
  }

  @Delete(':id')
  @Roles(RolesList.ADMIN)
  @ApiOperation({ summary: 'Delete menu by ID (Admin only)' })
  async delete(@Param('id') id: string): Promise<CommonResponseDto<void>> {
    await this.menuService.delete(id);
    return CommonResponseDto.ok(null, Messages.success.menu.deleted(1));
  }
}
