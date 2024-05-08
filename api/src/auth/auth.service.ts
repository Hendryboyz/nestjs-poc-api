import { Injectable } from '@nestjs/common';
import { OAuthUserInfo } from './auth.types';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(private user: UserService) {

  }

  generateAuthJwtToken(userInfo: OAuthUserInfo) {
    const identity = this.findIdentity(userInfo.idp, userInfo.id, userInfo.email);
    if (!identity) {
      const newIdentity = this.createIdentity(userInfo.idp, userInfo.id, userInfo.email);
      this.user.createNewUser(userInfo);
      return this.generateJwtToken(newIdentity);
    } else {
      return this.generateJwtToken(identity);
    }
  }

  private findIdentity(idp: string, id: string, email: string): any {
    throw new Error('Method not implemented.');
  }

  private createIdentity(idp: string, id: string, email: string) {
    throw new Error('Method not implemented.');
  }

  private generateJwtToken(newIdentity: any): string {
    throw new Error('Method not implemented.');
  }
}
