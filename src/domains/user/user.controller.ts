import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  CreateUserDto,
  UpdateUserDto,
  UpdateUserRoleDto,
} from './dto/user.dto';
import { User } from './user.schema';
import { SearchUserDto } from './dto/search.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiPaginatedResponse } from 'src/common/decorators/api-paginated-response.decorator';
import { Paginated } from 'src/common/types/pagination.type';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from './dto/response/create-user-response';
import { CommonResponseDto } from 'src/common/dto/common-response.dto';
import { Messages } from 'src/common/message/tem';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { RolesList } from 'src/common/types/role';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('search')
  @Roles(RolesList.ADMIN)
  @ApiOkResponse({ type: ApiPaginatedResponse(User) })
  async searchUsers(
    @Query() filters: SearchUserDto,
  ): Promise<CommonResponseDto<User[]>> {
    const { data, page, limit, total } =
      await this.userService.searchUsers(filters);
    const message = Messages.success.user.listFetched(data.length);

    return CommonResponseDto.ok(data, message, {
      page,
      limit,
      total,
    });
  }

  @Post()
  @ApiCreatedResponse({ type: CommonResponseDto })
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<CommonResponseDto<UserResponseDto>> {
    const user = await this.userService.create(createUserDto);
    const userDto = plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
    const message = Messages.success.user.created(userDto.username);

    return CommonResponseDto.ok(userDto, message);
  }

  @Get()
  @ApiOkResponse({ type: CommonResponseDto })
  async findAll(): Promise<CommonResponseDto<UserResponseDto[]>> {
    const users = await this.userService.findAll();
    const dto = plainToInstance(UserResponseDto, users, {
      excludeExtraneousValues: true,
    });

  return CommonResponseDto.ok(
  dto,
  Messages.success.user.listFetched(dto.length),
);

  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', type: String, description: 'User ID' })
  @ApiOkResponse({
    description: 'User found successfully',
    type: CommonResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    type: CommonResponseDto,
  })
 async findOne(
  @Param('id') id: string,
): Promise<CommonResponseDto<UserResponseDto>> {
  const user = await this.userService.findOne(id);

  if (!user) {
    return CommonResponseDto.fail(
      Messages.error.user.notFound(id)
    );
  }

  const userDto = plainToInstance(UserResponseDto, user, {
    excludeExtraneousValues: true,
  });

  return CommonResponseDto.ok(
    userDto,
    Messages.success.user.fetched(user.username)
  );
}


  @Put(':id')
  @ApiOperation({ summary: 'Update a user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: CommonResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid user ID',
    type: CommonResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    type: CommonResponseDto,
  })
async update(
  @Param('id') id: string,
  @Body() updateUserDto: UpdateUserDto,
): Promise<CommonResponseDto<UserResponseDto>> {
  const updatedUser = await this.userService.update(id, updateUserDto);

  if (!updatedUser) {
    return CommonResponseDto.fail(Messages.error.user.notFound(id));
  }

  const userDto = plainToInstance(UserResponseDto, updatedUser, {
    excludeExtraneousValues: true,
  });

  return CommonResponseDto.ok(
    userDto,
    Messages.success.user.updated(userDto.username),
  );
}


  @Delete('bulk')
  @ApiOperation({ summary: 'Delete multiple users by IDs' })
  @ApiBody({
    description: 'Array of user IDs to delete',
    schema: {
      type: 'object',
      properties: { userIds: { type: 'array', items: { type: 'string' } } },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Users deleted successfully',
    type: CommonResponseDto,
  })
  async deleteUsers(@Body('userIds') userIds: string[]) {
    await this.userService.deleteUsersByIds(userIds);
    return CommonResponseDto.ok(
      null,
      Messages.success.user.deleted(userIds.length),
    );
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.userService.delete(id);
  }
  @Patch(':id/role')
  @ApiOperation({ summary: 'Update user role' })
  @ApiParam({ name: 'id', type: String, description: 'User ID' })
  @ApiBody({ type: UpdateUserRoleDto })
  @ApiOkResponse({
    description: 'User role updated successfully',
    type: CommonResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    type: CommonResponseDto,
  })
  async updateUserRole(
    @Param('id') userId: string,
    @Body() updateUserRoleDto: UpdateUserRoleDto,
  ) {
    const updatedUser = await this.userService.updateRole(
      userId,
      updateUserRoleDto.roleId,
    );

    return CommonResponseDto.ok(
      updatedUser,
      Messages.success.user.roleUpdated(updatedUser.username),
    );
  }
}
