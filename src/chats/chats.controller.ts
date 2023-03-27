import { Controller, Get, Headers, UseGuards } from '@nestjs/common';
import { HeaderAuthGuard } from 'src/auth/header/header.guard';
import { UsersService } from 'src/users/users.service';
import { ChatsService } from './chats.service';

@Controller('chats')
export class ChatsController {
  constructor(
    private readonly chatService: ChatsService,
    private readonly userService: UsersService,
  ) {}

  @UseGuards(HeaderAuthGuard)
  @Get('/budder')
  async getBudderMessage(@Headers('u') u: string) {
    const userId = await this.userService
      .getUser(u)
      .then((user) => user.user.userId);
    return this.chatService.fetchBudderMessage(userId);
  }

  @UseGuards(HeaderAuthGuard)
  @Get('/buddy')
  async getBuddyMessage(@Headers('u') u: string) {
    const userId = await this.userService
      .getUser(u)
      .then((user) => user.user.userId);
    return this.chatService.fetchBuddyMessage(userId);
  }
}
