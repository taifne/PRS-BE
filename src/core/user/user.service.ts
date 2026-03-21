import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BaseService } from 'src/common/base';
import { User, UserDocument } from './user.schema';
import { Role, RoleDocument } from '../role/role.schema';
import { SearchUserDto, UserResponseDto } from './dto/search-user.dto';
import { PunchService } from '../../domains/shopping-cart/punch/punch.service';
import { UserWithRoles } from './interfaces/user-with-roles.interface';
import { plainToInstance } from 'class-transformer';
import { DatabaseMessages, UserMessages, ValidationMessages } from 'src/common/messages';

@Injectable()
export class UserService extends BaseService<UserDocument> {
  constructor(
    @InjectModel(User.name) userModel: Model<UserDocument>,
    @InjectModel(Role.name) private readonly roleModel: Model<RoleDocument>,
    private readonly punchService: PunchService,
  ) {
    super(userModel);
  }

  async findByEmail(email: string): Promise<UserWithRoles | null> {
    return this.model
      .findOne({ email })
      .populate('roles', 'name')
      .lean<UserWithRoles>()
      .exec();
  }

  async findAll(): Promise<UserDocument[]> {
    return super.findAll({
      path: 'roles',
      select: 'name',
    });
  }

  async getRoleNamesByIds(
    roleIds: (string | Types.ObjectId)[],
  ): Promise<string[]> {
    const objectIds = roleIds
      .filter((id) => Types.ObjectId.isValid(id))
      .map((id) => new Types.ObjectId(id));

    const roles = await this.roleModel.find({
      _id: { $in: objectIds },
    });

    if (!roles.length) {
      throw new NotFoundException('No roles found');
    }

    return roles.map((role) => role.name);
  }

  async updateRole(userId: string, roleId: string): Promise<UserDocument> {
    if (!Types.ObjectId.isValid(roleId)) {
      throw new NotFoundException(DatabaseMessages.notFound(roleId));
    }

    const updatedUser = await this.model
      .findByIdAndUpdate(userId, { role: roleId }, { new: true })
      .populate('role')
      .exec();

    if (!updatedUser) {
      throw new NotFoundException(DatabaseMessages.notFound(userId));
    }

    return updatedUser;
  }


  async searchUsers(filters: SearchUserDto): Promise<{
    data: UserResponseDto[];
    page: number;
    limit: number;
    total: number;
  }> {
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
      if (!Types.ObjectId.isValid(role)) {
        throw new BadRequestException('Invalid role id');
      }
      query.role = role;
    }

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.model.find(query).populate('roles').skip(skip).limit(limit),
      this.model.countDocuments(query),
    ]);

    const mapped = plainToInstance(UserResponseDto, data, {
      excludeExtraneousValues: true,
    });

    return { data: mapped, total, page, limit };
  }

  async deleteUsersByIds(userIds: string[]): Promise<void> {
    const validIds = userIds.filter(Types.ObjectId.isValid);

    if (!validIds.length) {
      throw new NotFoundException(ValidationMessages.invalid("User Id"));
    }

    const result = await this.model.deleteMany({
      _id: { $in: validIds },
    });

    if (!result.deletedCount) {
      throw new NotFoundException(DatabaseMessages.notFound('given IDs'));
    }
  }
}
