import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';
export interface UserPayload {
  id: number;
  email: string;
  roles: string[];
  password: string;
}
@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async validateUser(userData: LoginDto) {
    const user = await this.userService.findByEmail(userData.email);
    if (!user) {
      return null;
    }
    const match = await bcrypt.compare(userData.password, user.password);

    if (!match) {
      return null;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...result } = user;
    return result;
  }

  async login(user: UserPayload) {
    const payload = {
      sub: user.id,
      email: user.email,
      roles: user.roles || [],
    };

    return {
      access_token: this.jwt.sign(payload, {
        secret: this.config.get('jwt.secret'), //get the details from the configuration files
        expiresIn: this.config.get('jwt.expiresIn'),
      }),
      refresh_token: this.jwt.sign(payload, {
        secret: this.config.get('jwt.secret'),
        expiresIn: this.config.get('jwt.refreshExpiresIn'),
      }),
    };
  }
}
