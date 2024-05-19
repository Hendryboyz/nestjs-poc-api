import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OAuthUserInfo } from './auth.types';
import { UserService } from '../user/user.service';
import { Repository } from 'typeorm';
import { IdentifierType, Identity } from './entities/identity.entity';

@Injectable()
export class AuthService {
  private readonly logger: Logger = new Logger(this.constructor.name);
  constructor(
    @InjectRepository(Identity)
    private readonly identity: Repository<Identity>,
    private readonly user: UserService,
  ) {
  }

  async generateAuthJwtToken(userInfo: OAuthUserInfo) {
    const identity = await this.findIdentity(userInfo.idp, userInfo.id, userInfo.email);
    if (!identity) {
      const newIdentity = await this.createIdentity(userInfo.idp, userInfo.id, userInfo.email);
      this.logger.log(`New identity created: ${JSON.stringify(newIdentity)}`);
      await this.user.createNewUser({ ...userInfo }, newIdentity);
      return this.generateJwtToken(newIdentity);
    } else {
      return this.generateJwtToken(identity);
    }
  }

  private findIdentity(idp: string, id: string, email: string): Promise<Identity | null> {
    return this.identity.findOne({
      where: { 
        provider: idp,
        providerId: id,
        identifier: email,
       }
    });
  }

  private createIdentity(idp: string, id: string, email: string): Promise<Identity> {
    const newInstance = this.identity.create();
    newInstance.provider = idp;
    newInstance.providerId = id;
    newInstance.identifierType = IdentifierType.Email;
    newInstance.identifier = email;
    return this.identity.save(newInstance);
  }

  private generateJwtToken(identity: Identity): string {
    // todo using identity id to generate a new user
    return 'jwt-token';
  }
}
