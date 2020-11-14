import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import AuthContext from '../interfaces/authContext';
import JwtPayload from '../interfaces/jwtPayload';

@Injectable()
export default class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  // After JWT is verified we receive it here
  async validate(jwtPayload: JwtPayload): Promise<AuthContext> {
    return {
      userId: jwtPayload.sub,
      username: jwtPayload.username,
      name: jwtPayload.name,
    };
  }
}
