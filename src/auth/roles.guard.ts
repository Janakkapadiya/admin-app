import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/user.model';
import { CanActivate, Injectable, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectRepository(User) private readonly repo: Repository<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log(context.getHandler());
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    console.log(roles);
    const request = context.switchToHttp().getRequest();
    console.log(request.user);

    if (request?.user) {
      const { id } = request.user;
      const user = await this.repo.findOne({ where: { id } });
      return roles.includes(user.roles);
    }

    return false;
  }
}
