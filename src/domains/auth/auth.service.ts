import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../user/user.service";
import * as bcrypt from "bcrypt";
import { LoginDto } from "./dtos/login.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { _id, email, role } = user;
      return  { _id, email, role };
    }
    return null;
  }

  async login({ email, password }: LoginDto) {
  const user = await this.validateUser(email, password);

  if (!user) {
    throw new UnauthorizedException("Invalid email or password");
  }

  // if user.role is an ObjectId, populate it to get the role name
  const roleName =
    typeof user.role === 'string'
      ? await this.userService.getRoleNameById(user.role) // add a method to fetch role name
      : user.role.name;

  const payload = { sub: user._id, email: user.email, role: roleName };

  return {
    access_token: this.jwtService.sign(payload),
    userRole: roleName,
    userId: user._id,
  };
}

  async register(createUserDto: any) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    return this.userService.create({
      ...createUserDto,
      password: hashedPassword,
    });
  }
}
