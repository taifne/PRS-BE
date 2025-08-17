// src/menus/menu.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateMenuDto, UpdateMenuDto } from './dto/menu.dto';
import { Menu, MenuDocument } from './menu.schema';

@Injectable()
export class MenuService {
  constructor(@InjectModel(Menu.name) private menuModel: Model<MenuDocument>) {}

  async create(dto: CreateMenuDto): Promise<Menu> {
    const menu = new this.menuModel(dto);
    return menu.save();
  }

  async findAll(): Promise<Menu[]> {
    return this.menuModel.find({ isActive: true }).populate('parent').exec();
  }

  async findOne(id: string): Promise<Menu> {
    const menu = await this.menuModel.findById(id).populate('parent').exec();
    if (!menu) throw new NotFoundException('Menu not found');
    return menu;
  }
async update(id: string, dto: UpdateMenuDto): Promise<Menu> {
  return this.menuModel.findByIdAndUpdate(id, dto, { new: true });
}

  async delete(id: string): Promise<void> {
    const result = await this.menuModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) throw new NotFoundException('Menu not found');
  }
}
