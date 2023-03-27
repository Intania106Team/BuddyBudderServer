import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  UseGuards,
} from '@nestjs/common';
import { HeaderAuthGuard } from 'src/auth/header/header.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/auth')
  login(@Body() body: { studentId: string; pin: string }) {
    return this.usersService.login(body.studentId, body.pin);
  }

  @UseGuards(HeaderAuthGuard)
  @Get('/profiles')
  userProfiles(@Headers('u') u: string) {
    return this.usersService.getAllProfiles(u);
  }

  @UseGuards(HeaderAuthGuard)
  @Get('/')
  ownProfile(@Headers('u') u: string) {
    return this.usersService.getUser(u);
  }

  @UseGuards(HeaderAuthGuard)
  @Get('/budder')
  getBudderId(@Headers('u') u: string) {
    return this.usersService.getBudderUserId(u);
  }

  @UseGuards(HeaderAuthGuard)
  @Get('/buddy')
  getBuddyId(@Headers('u') u: string) {
    return this.usersService.getBuddyUserId(u);
  }
}
