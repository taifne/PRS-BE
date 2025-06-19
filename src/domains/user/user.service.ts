import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { PunchService } from '../user copy/punch.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly punchService: PunchService,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec(); // `lean()` removes Mongoose document wrapper
  }

   async create(createUserDto: CreateUserDto): Promise<User> {
    const user = new this.userModel(createUserDto);
    const savedUser = await user.save();

    // Automatically create punch record for today (or initial punch)
    await this.punchService.generatePunchesForUser(savedUser._id.toString());

    return savedUser;
  }

  async findAll(): Promise<User[]> {
    return this.userModel
      .find()
      .populate({
        path: 'role',
        select: 'name',
      })
      .exec();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
    if (!updatedUser)
      throw new NotFoundException(`User with ID ${id} not found`);
    return updatedUser;
  }

  async delete(id: string): Promise<User> {
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
    if (!deletedUser)
      throw new NotFoundException(`User with ID ${id} not found`);
    return deletedUser;
  }
  async updateRole(userId: string, roleId: string): Promise<User> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(userId, { role: roleId }, { new: true })
      .populate('role')
      .exec();

    if (!updatedUser)
      throw new NotFoundException(`User with ID ${userId} not found`);
    return updatedUser;
  }
  async searchUsers(filters: Record<string, string>): Promise<User[]> {
    const { username = '', email = '', role = '' } = filters;

    const query: any = {};

    if (username?.trim()) {
      query.username = { $regex: username.trim(), $options: 'i' };
    }

    if (email?.trim()) {
      query.email = { $regex: email.trim(), $options: 'i' };
    }

    if (role?.trim()) {
      if (Types.ObjectId.isValid(role)) {
        query.role = role;
      } else {
        throw new Error('Invalid role id');
      }
    }

  
    return this.userModel.find(query).populate('role').exec();
  }

  async deleteUsersByIds(userIds: string[]): Promise<void> {
    const result = await this.userModel.deleteMany({
      _id: { $in: userIds },
    });

    if (result.deletedCount === 0) {
      throw new NotFoundException('No users found to delete.');
    }
  }
}
