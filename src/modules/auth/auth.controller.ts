import { Controller, Post, Body, Res, HttpCode } from '@nestjs/common';
import { AuthService, UserPayload } from './auth.service';
import { LoginDto } from './dto/login.dto';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('login')
  @HttpCode(200)
  async login(@Body() body: LoginDto, @Res({ passthrough: true }) res: Response) {
    const user = await this.auth.validateUser(body);

    if (!user) {
      return { statusCode: 401, message: 'Invalid credentials' };
    }

    const { access_token, refresh_token } = await this.auth.login(user as unknown as UserPayload);

    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: false, // true in production
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { access_token };
  }
}
