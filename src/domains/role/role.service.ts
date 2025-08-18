// src/roles/role.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {  UpdateRoleDto } from './dto/request/update-role.dto.ts.js';
import { Role, RoleDocument } from './role.schema';
import { CreateRoleDto } from './dto/request/create-role.dto.js';

@Injectable()
export class RoleService {
  constructor(@InjectModel(Role.name) private readonly roleModel: Model<RoleDocument>) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const existing = await this.findByName(createRoleDto.name);
    if (existing) throw new BadRequestException(`Role '${createRoleDto.name}' already exists`);

    const role = new this.roleModel(createRoleDto);
    return role.save();
  }

  async findAll(): Promise<Role[]> {
    return this.roleModel.find().populate('menus').exec();
  }

  async findById(id: string): Promise<Role> {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('Invalid role ID');

    const role = await this.roleModel.findById(id).populate('menus').exec();
    if (!role) throw new NotFoundException(`Role with ID '${id}' not found`);
    return role;
  }

  async findByName(name: string): Promise<Role | null> {
    return this.roleModel.findOne({ name }).exec();
  }

  async remove(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('Invalid role ID');

    const result = await this.roleModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) throw new NotFoundException(`Role with ID '${id}' not found`);
  }

  async updateMenusInRole(roleId: string, menuIds: string[]): Promise<Role> {
    if (!Types.ObjectId.isValid(roleId)) throw new BadRequestException('Invalid role ID');

    const role = await this.roleModel.findById(roleId);
    if (!role) throw new NotFoundException(`Role with ID '${roleId}' not found`);


    const menuObjectIds = menuIds.map((id) => {
      if (!Types.ObjectId.isValid(id)) throw new BadRequestException(`Invalid menu ID: ${id}`);
      return new Types.ObjectId(id);
    });

    role.menus = menuObjectIds;
    return role.save();
  }

  async updateRole(roleId: string, updateDto: UpdateRoleDto): Promise<Role> {
    const role = await this.roleModel.findById(roleId);
    if (!role) throw new NotFoundException(`Role with ID '${roleId}' not found`);

    if (updateDto.name) role.name = updateDto.name;
    if (updateDto.description) role.description = updateDto.description;

    return role.save();
  }
}
