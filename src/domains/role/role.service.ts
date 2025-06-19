// src/roles/role.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateRoleDto } from './dto/role.dto';
import { Role, RoleDocument } from './role.schema';

@Injectable()
export class RoleService {
  constructor(@InjectModel(Role.name) private roleModel: Model<RoleDocument>) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const createdRole = new this.roleModel(createRoleDto);
    return createdRole.save();
  }

  async findAll(): Promise<Role[]> {
    return this.roleModel.find().populate("menus").exec();
  }

  async findById(id: string): Promise<Role> {
    const role = await this.roleModel.findById(id).populate("menus").exec();;
   
    if (!role) throw new NotFoundException('Role not found');
    return role;
  }

  async findByName(name: string): Promise<Role | null> {
    return this.roleModel.findOne({ name }).exec();
  }

  async remove(id: string): Promise<void> {
    const result = await this.roleModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) throw new NotFoundException('Role not found');
  }
  async updateMenuInRole(roleId: string, menuIds: string[]): Promise<Role> {
    const role = await this.roleModel.findById(roleId);
    if (!role) {
      throw new NotFoundException('Role not found');
    }
  
    // Convert string IDs to ObjectIds
    const menuObjectIds = menuIds.map((id) => new Types.ObjectId(id));
  
    // Update menus
    role.menus = menuObjectIds;
  
    return role.save();
  }
  
}
