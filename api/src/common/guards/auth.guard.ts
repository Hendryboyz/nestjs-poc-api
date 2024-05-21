import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private jwtSecret: string;
  constructor(
    private jwt: JwtService,
    private config: ConfigService,
  ) {
    this.jwtSecret = this.config.get<string>('auth.jwtSecret');
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const token = this.extractJwtToken(req);
    if (!token) {
      throw new UnauthorizedException(`Missing Bearer token for auth`)
    }

    try {
      const payload = await this.jwt.verifyAsync(token, { secret: this.jwtSecret });
      req['identity'] = payload
    } catch {
      throw new UnauthorizedException(`Invalid Bearer token`);
    }
    
    return true;
  }

  private extractJwtToken(request: Request): string {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}