import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { RoleService } from './role.service';

import { UpdateRoleMenusDto } from './dto/request/update-menus.dto';
import { RoleResponseDto } from './dto/response/role-response.dto';
import { CommonResponseDto } from 'src/common/dto/common-response.dto';
import { plainToInstance } from 'class-transformer';

import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiOkResponse,
} from '@nestjs/swagger';
import { AuditGuard } from '../auth/guards/audit.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ROUTES } from 'src/common/constants/routes.constant';
import { RolesList } from 'src/common/types/role';
import { Roles } from '../auth/decorators/roles.decorator';
import { Messages } from 'src/common/message/messages';
import { CreateRoleDto } from './dto/request/create-role.dto';

@ApiTags('Administration / Role')
@Controller()
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard, AuditGuard)
@Controller(ROUTES.ADMINISTRATION.ROLE)
@Roles(RolesList.ADMIN)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @Roles(RolesList.ADMIN, RolesList.USER)
  @ApiOperation({ summary: 'Create a new role (Admin/User)' })
  async create(
    @Body() createRoleDto: CreateRoleDto,
  ): Promise<CommonResponseDto<RoleResponseDto>> {
    const role = await this.roleService.create(createRoleDto);
    const dto = plainToInstance(RoleResponseDto, role, {
      excludeExtraneousValues: true,
    });
    return CommonResponseDto.ok(dto, Messages.success.role.created(dto.name));
  }

  @Get()
  @ApiOperation({ summary: 'Get all roles' })
  @ApiOkResponse({ type: CommonResponseDto })
  async findAll(): Promise<CommonResponseDto<RoleResponseDto[]>> {
    const roles = await this.roleService.findAll();

    const dto = plainToInstance(RoleResponseDto, roles, {
      excludeExtraneousValues: true,
    });

    return CommonResponseDto.ok(
      dto,
      Messages.success.role.listFetched(dto.length),
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get role by ID' })
  @ApiOkResponse({ type: CommonResponseDto })
  async findOne(
    @Param('id') id: string,
  ): Promise<CommonResponseDto<RoleResponseDto>> {
    const role = await this.roleService.findById(id);

    if (!role) {
      return CommonResponseDto.fail(Messages.error.user.roleNotFound(id));
    }

    const dto = plainToInstance(RoleResponseDto, role, {
      excludeExtraneousValues: true,
    });

    return CommonResponseDto.ok(dto, Messages.success.role.fetched(dto.name));
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete role by ID (Admin only)' })
  @ApiOkResponse({ type: CommonResponseDto }) // void response, still typed
  async remove(@Param('id') id: string): Promise<CommonResponseDto<void>> {
    await this.roleService.remove(id);

    return CommonResponseDto.ok(null, Messages.success.role.deleted(1));
  }

  @Patch(':id/menus')
  @ApiOperation({ summary: 'Update menus in role (Admin only)' })
  @ApiOkResponse({ type: CommonResponseDto<RoleResponseDto> })
  async updateMenusInRole(
    @Param('id') roleId: string,
    @Body() dto: UpdateRoleMenusDto,
  ): Promise<CommonResponseDto<RoleResponseDto>> {
    const updatedRole = await this.roleService.updateMenusInRole(
      roleId,
      dto.menuIds,
    );

    const response = plainToInstance(RoleResponseDto, updatedRole, {
      excludeExtraneousValues: true,
    });

    return CommonResponseDto.ok(
      response,
      Messages.success.role.menusUpdated(response.name),
    );
  }
}
