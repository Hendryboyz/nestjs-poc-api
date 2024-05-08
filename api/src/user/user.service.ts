import { Injectable } from '@nestjs/common';
import { UserInfo } from './user.types';

@Injectable()
export class UserService {
  createNewUser(userInfo: UserInfo) {
    throw new Error('Method not implemented.');
  }
}
