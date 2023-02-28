import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ApplyUser extends AuthGuard('jwt') {
  handleRequest(err: any, user: any) {
    if (user) return user;
    return null;
  }
}
