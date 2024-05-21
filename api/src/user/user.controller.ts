import { Controller, Get, Logger, Request as Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../common/guards/auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  private readonly logger = new Logger(this.constructor.name);
  constructor (
    private readonly userService: UserService
  ) {

  }

  @Get('me')
  async findUserProfile(@Req() req: any) {
    const payload = req.identity;
    const id = payload['sub']
    return await this.userService.findByIdentity(id);
  }
}
