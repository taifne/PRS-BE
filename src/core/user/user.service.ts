import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
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
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/user.dto';
@Injectable()
export class UserService extends BaseService<UserDocument> {
  constructor(
    @InjectModel(User.name) userModel: Model<UserDocument>,
    @InjectModel(Role.name) private readonly roleModel: Model<RoleDocument>,
    private readonly punchService: PunchService,
  ) {
    super(userModel);
  }

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const { roleIds = [], password, ...rest } = createUserDto;

    let roles: string[] = roleIds;

    // ✅ Validate ObjectId (only if roles array has items)
    if (roles.length > 0) {
      const invalidIds = roles.filter(id => !Types.ObjectId.isValid(id));
      if (invalidIds.length) {
        throw new BadRequestException(`Invalid roleIds: ${invalidIds.join(', ')}`);
      }

      // ✅ Validate roles exist in database
      const foundRoles = await this.roleModel.find({
        _id: { $in: roles },
      });

      if (foundRoles.length !== roles.length) {
        const foundIds = foundRoles.map(role => role._id.toString());
        const missingIds = roles.filter(id => !foundIds.includes(id));
        throw new BadRequestException(`Roles not found: ${missingIds.join(', ')}`);
      }
    }

    // ✅ Default role if no roles provided
    if (!roles.length) {
      const defaultRole = await this.roleModel.findOne({ name: 'user' });
      if (defaultRole) {
        roles = [defaultRole._id.toString()];
      } else {
        // ✅ Fallback: create default 'user' role if it doesn't exist
        const newDefaultRole = await this.roleModel.create({
          name: 'user',
          description: 'Default user role',
          isActive: true,
        });
        roles = [newDefaultRole._id.toString()];
      }
    }

    // ✅ Check if username already exists
    const existingUsername = await this.model.findOne({
      username: rest.username,
    });
    if (existingUsername) {
      throw new ConflictException(`Username "${rest.username}" already exists`);
    }

    // ✅ Check if email already exists
    const existingEmail = await this.model.findOne({
      email: rest.email,
    });
    if (existingEmail) {
      throw new ConflictException(`Email "${rest.email}" already exists`);
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Save user
    const newUser = new this.model({
      ...rest,
      password: hashedPassword,
      roles,
    });

    return newUser.save();
  }
  async updateOne(filter: any, update: any): Promise<any> {
    return this.model.updateOne(filter, update).exec();
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

async updateRoles(
  userId: string,
  roleIds: string[],
): Promise<UserDocument> {

  // validate userId
  if (!Types.ObjectId.isValid(userId)) {
    throw new NotFoundException(DatabaseMessages.notFound(userId));
  }

  // validate all roleIds
  const invalidIds = roleIds.filter(id => !Types.ObjectId.isValid(id));
  if (invalidIds.length > 0) {
    throw new NotFoundException(
      DatabaseMessages.notFound(`Invalid roleIds: ${invalidIds.join(', ')}`),
    );
  }

  const updatedUser = await this.model
    .findByIdAndUpdate(
      userId,
      { roles: roleIds }, // ✅ FIX HERE (array)
      { new: true },
    )
    .populate('roles')
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
      query.username = { $regex: username.trim(), $options: 'i' };
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
