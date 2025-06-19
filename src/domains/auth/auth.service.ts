import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../user/user.service";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { _id, email, role } = user; // Extract only necessary fields
      return  { _id, email, role };
    }
    return null;
  }

  async login({ email, password }) {
    const user = await this.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException("Invalid email or password");
    }

    return {
      access_token: this.jwtService.sign({ email, role: user.role }),
      userRole: user.role,
      userId:user._id
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
