// src/menus/menu.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateMenuDto, UpdateMenuDto } from './dto/menu.dto';
import { Menu, MenuDocument } from './menu.schema';
import { DatabaseMessages, MenuMessages, ValidationMessages } from 'src/common/messages';

@Injectable()
export class MenuService {
  constructor(@InjectModel(Menu.name) private menuModel: Model<MenuDocument>) { }

  async create(dto: CreateMenuDto): Promise<Menu> {
    const menu = new this.menuModel(dto);
    return menu.save();
  }

  async findAll(): Promise<Menu[]> {
    return this.menuModel.find({ isActive: true }).populate('parent').exec();
  }

  async findOne(id: string): Promise<Menu> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(
        ValidationMessages.invalid('menu ID'),
      );
    }

    const menu = await this.menuModel.findById(id).populate('parent').exec();
    if (!menu) throw new NotFoundException(DatabaseMessages.notFound(id));

    return menu;
  }

  async update(id: string, dto: UpdateMenuDto): Promise<Menu> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(
        ValidationMessages.invalidFormat('menu ID'),
      );
    }

    const updatedMenu = await this.menuModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!updatedMenu)
      throw new NotFoundException(DatabaseMessages.notFound(id));

    return updatedMenu;
  }

  async delete(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(
        ValidationMessages.invalidFormat('menu ID'),
      );
    }

    const result = await this.menuModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0)
      throw new NotFoundException(DatabaseMessages.notFound(id));
  }
}
