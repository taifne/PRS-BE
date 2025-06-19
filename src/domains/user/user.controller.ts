import { Controller, Get, Post, Put, Delete, Body, Param, Patch, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto, UpdateUserRoleDto } from './dto/user.dto';
import { User } from './user.schema';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}


  @Get('search')
  async searchUsers(@Query() filters: Record<string, string>): Promise<User[]> {
    return this.userService.searchUsers(filters);
  }
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }
  @Delete('bulk')
  async deleteUsers(@Body('userIds') userIds: string[]) {
    await this.userService.deleteUsersByIds(userIds);
    return { message: 'Users deleted successfully' };
  }
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.userService.delete(id);
  }
  @Patch(':id/role')
  async updateUserRole(
    @Param('id') userId: string,
    @Body() updateUserRoleDto: UpdateUserRoleDto
  ) {
    return this.userService.updateRole(userId, updateUserRoleDto.roleId);
  }
 
}
