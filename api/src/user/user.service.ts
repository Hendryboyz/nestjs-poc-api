import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserInfo } from './user.types';
import { User } from './entities/user.entity';
import { Identity } from '../auth/entities/identity.entity';

@Injectable()
export class UserService {
  private readonly logger = new Logger(this.constructor.name);
  constructor(
    @InjectRepository(User)
    private readonly user: Repository<User>
  ) {}

  async createNewUser(userInfo: UserInfo, identity: Identity) {
    const newOne = this.user.create();
    newOne.firstName = userInfo.firstName;
    newOne.lastName = userInfo.lastName;
    newOne.identity = identity;
    
    const createdOne = await this.user.save(newOne);
    this.logger.debug(`New user created: ${JSON.stringify(createdOne)}`)
    return createdOne;
  }

  findByIdentity(id: string) {
    return this.user.findOne({
      where: {
        identity: {
          id
        }
      }
    })
  }
}
