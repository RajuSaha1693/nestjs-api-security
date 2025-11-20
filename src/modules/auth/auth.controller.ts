import { Controller, Post, Body, Res, HttpCode, Req, UnauthorizedException } from '@nestjs/common';
import { AuthService, UserPayload } from './auth.service';
import { LoginDto } from './dto/login.dto';
import type { Request, Response } from 'express';

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

  @Post('refresh')
  @HttpCode(200)
  async refresh(@Req() req: Request) {
    const cookies = req.cookies as Record<string, string>;
    const refreshToken = cookies.refresh_token;
    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token provided');
    }

    const { access_token } = await this.auth.refresh(refreshToken);
    return { access_token };
  }

  @Post('logout')
  @HttpCode(200)
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: false, // true in production
      sameSite: 'lax',
    });
    return { message: 'Logged out successfully' };
  }
}
