import { BadRequestException, Controller, Get, Logger, Req, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { Credentials, OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { OAuthUserInfo } from './auth.types';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  private logger = new Logger(this.constructor.name);

  constructor(
    private readonly jwt: JwtService,
    private readonly auth: AuthService,
  ) {
    
  }

  @Get('google/login')
  public async loginGoogle(@Res() res: Response) {
    const oauth2Client = this.buildOAuth2Client();

    const scopes = [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ];

    const authorizationUrl = this.generateAuthUrl(oauth2Client, scopes);

    res.redirect(authorizationUrl);
  }

  private buildOAuth2Client() {
    const googleOAuthConfig = require('../../google_oauth_secret_local.json');
    this.logger.debug(googleOAuthConfig);

    const oauth2Client = new google.auth.OAuth2(
      googleOAuthConfig['web']['client_id'],
      googleOAuthConfig['web']['client_secret'],
      googleOAuthConfig['web']['redirect_uris'][0]
    );
    return oauth2Client;
  }

  private generateAuthUrl(oauth2Client: OAuth2Client, scopes: string[]) {
    return oauth2Client.generateAuthUrl({
      // 'online' (default) or 'offline' (gets refresh_token)
      access_type: 'offline',
      /** Pass in the scopes array defined above.
        * Alternatively, if only one scope is needed, you can pass a scope URL as a string */
      scope: scopes,
      // Enable incremental authorization. Recommended as a best practice.
      include_granted_scopes: true,
    });
  }


  @Get('google/redirect')
  public async googleCallback(@Req() req: Request, @Res() res: Response) {
    const code = req.query['code'].toString();
    if (!code) {
      throw new BadRequestException(`Authorize with google fail: missing access token`)
    }
    const oauth2Client = this.buildOAuth2Client();
    let { tokens } = await oauth2Client.getToken(code)
    const userInfo = this.parseUserInfo(tokens);
    const token = this.auth.generateAuthJwtToken(userInfo);
    res.cookie('auth-token', token)
    return userInfo
  }

  private parseUserInfo(tokens: Credentials): OAuthUserInfo {
    const {
      // access_token: accessToken,
      id_token: jwtToken
    } = tokens;

    // const response = await api.get('https://www.googleapis.com/oauth2/v1/userinfo?alt=json')
    //   .set('Authorization', `Bearer ${accessToken}`)

    const userinfo = this.jwt.decode(jwtToken, { json: true })
    this.logger.debug(userinfo);

    return {
      idp: 'google',
      id: userinfo['sub'], // subject
      name: userinfo['name'],
      firstName: userinfo['given_name'],
      lastName: userinfo['family_name'],
      email: userinfo['email']
    }
  }
}
