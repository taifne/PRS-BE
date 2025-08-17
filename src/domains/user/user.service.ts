import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { PunchService } from '../user copy/punch.service';
import { SearchUserDto } from './dto/search.dto';
import { Messages } from 'src/common/message/tem';
import { Role, RoleDocument } from '../role/role.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Role.name) private roleModel: Model<RoleDocument>,
    private readonly punchService: PunchService,
  ) {}
  async getRoleNameById(roleId: string | Types.ObjectId): Promise<string> {
    const role = await this.roleModel.findById(roleId).exec();
    if (!role) {
      throw new Error('Role not found');
    }
    return role.name;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec(); // `lean()` removes Mongoose document wrapper
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = new this.userModel(createUserDto);
    const savedUser = await user.save();

    // Automatically create punch record for today (or initial punch)
    // await this.punchService.generatePunchesForUser(savedUser._id.toString());

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
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(
        Messages.error.validation.invalidFormat('user ID'),
      );
    }

    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException(Messages.error.user.notFound(id));

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    // Validate ObjectId first
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(Messages.error.user.notFound(id));
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();

    if (!updatedUser) {
      throw new NotFoundException(Messages.error.user.notFound(id));
    }

    return updatedUser;
  }

  async delete(id: string): Promise<User> {
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();

    if (!deletedUser) {
      throw new NotFoundException(Messages.error.user.notFound(id));
    }

    return deletedUser;
  }

  async updateRole(userId: string, roleId: string): Promise<User> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new NotFoundException(Messages.error.user.notFound(userId));
    }
    if (!Types.ObjectId.isValid(roleId)) {
      throw new NotFoundException(Messages.error.user.roleNotFound(roleId));
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(userId, { role: roleId }, { new: true })
      .populate('role')
      .exec();

    if (!updatedUser) {
      throw new NotFoundException(Messages.error.user.notFound(userId));
    }

    return updatedUser;
  }
  async searchUsers(filters: SearchUserDto) {
    const {
      username,
      email,
      role,
      address,
      phone,
      page = 1,
      limit = 10,
    } = filters;

    const query: any = {};

    if (username?.trim())
      query.displayName = { $regex: username.trim(), $options: 'i' };
    if (email?.trim()) query.email = { $regex: email.trim(), $options: 'i' };
    if (address?.trim())
      query.address = { $regex: address.trim(), $options: 'i' };
    if (phone?.trim()) query.phone = { $regex: phone.trim(), $options: 'i' };
    if (role?.trim()) {
      if (!Types.ObjectId.isValid(role)) throw new Error('Invalid role id');
      query.role = role;
    }

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.userModel
        .find(query)
        // .select('username displayName email phone role')
        .populate('role')
        .skip(skip)
        .limit(limit)
        .exec(),
      this.userModel.countDocuments(query),
    ]);

    return { data, total, page, limit };
  }

  async deleteUsersByIds(userIds: string[]): Promise<void> {
    const validIds = userIds.filter((id) => Types.ObjectId.isValid(id));

    if (validIds.length === 0) {
      throw new NotFoundException(Messages.error.user.invalidIds);
    }

    const result = await this.userModel.deleteMany({
      _id: { $in: validIds },
    });

    if (result.deletedCount === 0) {
      throw new NotFoundException(Messages.error.user.notFound('given IDs'));
    }
  }
}
