import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { User } from 'src/user/user.model';

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@InjectRepository(User) private readonly repo: Repository<User>) {
    super({
      ignoreExpiration: false,
      secretOrKey: 'kldwsnndjwned23847hdnnkndj###HJionsdue8jo9mx',
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Authenticated;
        },
      ]),
    });
  }

  async validate(payload: any, req: Request) {
    if (!payload) {
      throw new UnauthorizedException();
    }
    const user = await this.repo.findOne({ where: { email: payload.email } });
    if (!user) {
      throw new UnauthorizedException();
    }
    req.user = user;
    return req.user;
  }
}
