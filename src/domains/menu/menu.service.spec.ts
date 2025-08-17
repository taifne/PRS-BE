import { Test, TestingModule } from '@nestjs/testing';
import { MenuService } from './menu.service';
import { getModelToken } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { CreateMenuDto, UpdateMenuDto } from './dto/menu.dto';
import { Menu } from './menu.schema';

const mockMenu = {
  _id: '507f1f77bcf86cd799439011',
  name: 'dashboard',
  label: 'Dashboard',
  isActive: true,
};

const mockMenuModel = () => ({
  create: jest.fn(),
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
});

describe('MenuService', () => {
  let service: MenuService;
  let model: Model<Menu>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MenuService,
        {
          provide: getModelToken(Menu.name),
          useFactory: mockMenuModel,
        },
      ],
    }).compile();

    service = module.get<MenuService>(MenuService);
    model = module.get<Model<Menu>>(getModelToken(Menu.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create()', () => {
    it('should create a new menu item', async () => {
      const dto: CreateMenuDto = { name: 'dashboard', label: 'Dashboard' };
      jest.spyOn(model, 'create').mockResolvedValueOnce(mockMenu as any);

      const result = await service.create(dto);
      expect(result).toEqual(mockMenu);
      expect(model.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll()', () => {
    it('should return an array of menus', async () => {
      jest.spyOn(model, 'find').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce([mockMenu]),
      } as any);

      const result = await service.findAll();
      expect(result).toEqual([mockMenu]);
    });
  });

  describe('findOne()', () => {
    it('should return a single menu item', async () => {
      jest.spyOn(model, 'findById').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(mockMenu),
      } as any);

      const result = await service.findOne('507f1f77bcf86cd799439011');
      expect(result).toEqual(mockMenu);
    });
  });

  describe('update()', () => {
    it('should update and return the updated menu item', async () => {
      const dto: UpdateMenuDto = { label: 'New Dashboard' };
      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce({ ...mockMenu, ...dto }),
      } as any);

      const result = await service.update('507f1f77bcf86cd799439011', dto);
      expect(result).toEqual({ ...mockMenu, ...dto });
    });
  });

  describe('delete()', () => {
    it('should delete and return the deleted menu item', async () => {
      jest.spyOn(model, 'findByIdAndDelete').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(mockMenu),
      } as any);

      const result = await service.delete('507f1f77bcf86cd799439011');
      expect(result).toEqual(mockMenu);
    });
  });
});
