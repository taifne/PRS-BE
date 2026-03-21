import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Delete,
  Patch,
} from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuDto, UpdateMenuDto } from './dto/menu.dto';

import { plainToInstance } from 'class-transformer';

import { ApiTags, ApiOperation, ApiCreatedResponse } from '@nestjs/swagger';
import { CommonResponseDto } from 'src/common/base/dtos/common-response.dto';
import { MenuMessages } from 'src/common/messages';
import { RolesList } from 'src/common/constants/role';
import { Roles } from '../../common/decorators/roles.decorator';
import { MenuResponseDto } from './dto/responses/menu-response.dto';

@ApiTags('Menu')
@Controller()
export class MenuController {
  constructor(private readonly menuService: MenuService) { }

  @Post()
  @Roles(RolesList.ADMIN)
  @ApiOperation({ summary: 'Create a new menu (Admin only)' })
  @ApiCreatedResponse({ type: CommonResponseDto })
  async create(
    @Body() dto: CreateMenuDto,
  ): Promise<CommonResponseDto<MenuResponseDto>> {
    const menu = await this.menuService.create(dto);
    const response = plainToInstance(MenuResponseDto, menu, {
      excludeExtraneousValues: true,
    });
    return CommonResponseDto.ok(
      response,
      MenuMessages.success.created(response.name),
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all menus' })
  async findAll(): Promise<CommonResponseDto<MenuResponseDto[]>> {
    const menus = await this.menuService.findAll();
    const dto = plainToInstance(MenuResponseDto, menus, {
      excludeExtraneousValues: true,
    });
    return CommonResponseDto.ok(
      dto,
      MenuMessages.success.listFetched(dto.length),
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get menu by ID' })
  async findOne(
    @Param('id') id: string,
  ): Promise<CommonResponseDto<MenuResponseDto>> {
    const menu = await this.menuService.findOne(id);
    if (!menu) return CommonResponseDto.fail('not found');
    const dto = plainToInstance(MenuResponseDto, menu, {
      excludeExtraneousValues: true,
    });
    return CommonResponseDto.ok(dto, MenuMessages.success.fetched(dto.name));
  }

  @Patch(':id')
  @Roles(RolesList.ADMIN)
  @ApiOperation({ summary: 'Update menu by ID (Admin only)' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateMenuDto,
  ): Promise<CommonResponseDto<MenuResponseDto>> {
    const updatedMenu = await this.menuService.update(id, dto);
    const response = plainToInstance(MenuResponseDto, updatedMenu, {
      excludeExtraneousValues: true,
    });
    return CommonResponseDto.ok(
      response,
      MenuMessages.success.updated(response.name),
    );
  }

  @Delete(':id')
  @Roles(RolesList.ADMIN)
  @ApiOperation({ summary: 'Delete menu by ID (Admin only)' })
  async delete(@Param('id') id: string): Promise<CommonResponseDto<void>> {
    await this.menuService.delete(id);
    return CommonResponseDto.ok(null, MenuMessages.success.deleted(1));
  }
}
