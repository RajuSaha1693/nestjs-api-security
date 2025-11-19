/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt, StrategyOptions, JwtFromRequestFunction } from 'passport-jwt';

interface JwtPayload {
  sub: number;
  email: string;
  roles: string[];
  iat: number;
  exp: number;
}

interface UserValidationResult {
  userId: number;
  roles: string[];
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private config: ConfigService) {
    const jwtSecret = config.get<string>('JWT_SECRET');

    if (!jwtSecret) {
      throw new Error('JWT_SECRET environment variable is not defined');
    }

    super({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken() as JwtFromRequestFunction,
      secretOrKey: jwtSecret,
      ignoreExpiration: false,
    } satisfies StrategyOptions);
  }

  async validate(payload: JwtPayload): Promise<UserValidationResult> {
    // Add null checks if needed
    if (!payload.sub || !payload.roles) {
      throw new Error('Invalid token payload');
    }

    return {
      userId: payload.sub,
      roles: payload.roles,
    };
  }
}
