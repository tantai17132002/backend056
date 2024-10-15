import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from './user.interface'; 

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'r81lA4aJvxEl8TQD4J6D7pgN2wUEopwigmX92nbNqdY',
    });
  }

  async validate(payload: JwtPayload) {
    return { id: payload.id, username: payload.username, email: payload.email };
  }
}










