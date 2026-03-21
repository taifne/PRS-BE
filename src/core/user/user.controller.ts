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
  Logger,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  CreateUserDto,
  UpdateUserDto,
  UpdateUserRoleDto,
} from './dto/user.dto';
import { User } from './user.schema';
import { SearchUserDto } from './dto/search-user.dto';
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
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from './dto/create-user-response.dto';
import { CommonResponseDto } from 'src/common/base/dtos/common-response.dto';
import { ROUTES } from 'src/common/constants/routes.constant';
import { AuthService } from '../auth/auth.service';
import { UserMessages } from 'src/common/messages';
@ApiTags('Administration / User')
@Controller()
@ApiBearerAuth()
// @UseGuards(JwtAuthGuard, RolesGuard, AuditGuard)
@Controller(ROUTES.ADMINISTRATION.USER)
export class UserController {
  constructor(private readonly userService: UserService) { }
  private readonly logger = new Logger(AuthService.name);

  @Get('search')
  @ApiOkResponse({ type: ApiPaginatedResponse(UserResponseDto) })
  async searchUsers(
    @Query() filters: SearchUserDto,
  ): Promise<CommonResponseDto<UserResponseDto[]>> {
    const { data, page, limit, total } =
      await this.userService.searchUsers(filters);
    const message = UserMessages.success.listFetched(data.length);

    return CommonResponseDto.ok(data, message, {
      page,
      limit,
      total,
    });
  }

  @Post()
  // @Roles(RolesList.USER)
  // @ApiCreatedResponse({ type: CommonResponseDto })
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<CommonResponseDto<UserResponseDto>> {
    const user = await this.userService.create(createUserDto);
    const userDto = plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
    const message = UserMessages.success.created(userDto.username);

    return CommonResponseDto.ok(userDto, message);
  }

  @Get()
  @ApiOperation({ summary: 'Get all User' })
  @ApiOkResponse({ type: CommonResponseDto })
  async findAll(): Promise<CommonResponseDto<UserResponseDto[]>> {
    this.logger.log(`User trying to login: }`);

    const users = await this.userService.findAll();
    const dto = plainToInstance(UserResponseDto, users, {
      excludeExtraneousValues: true,
    });

    return CommonResponseDto.ok(
      dto,
      UserMessages.success.listFetched(dto.length),
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
      return CommonResponseDto.fail(UserMessages.error.notFound(id));
    }

    const userDto = plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });

    return CommonResponseDto.ok(
      userDto,
      UserMessages.success.fetched(user.username),
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
      return CommonResponseDto.fail(UserMessages.error.notFound(id));
    }

    const userDto = plainToInstance(UserResponseDto, updatedUser, {
      excludeExtraneousValues: true,
    });

    return CommonResponseDto.ok(
      userDto,
      UserMessages.success.updated(userDto.username),
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
      UserMessages.success.deleted(userIds.length),
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
      UserMessages.success.roleUpdated(updatedUser.username),
    );
  }
}
