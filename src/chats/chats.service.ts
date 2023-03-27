import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { Chat } from './chats.models';

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(Chat) private readonly chatRepository: Repository<Chat>,
    private readonly userService: UsersService,
    private readonly authService: AuthService,
  ) {}

  async messageToBudder(
    message: { text?: string; image?: string },
    userId: string,
  ) {
    const budderId = (await this.userService.findOne(userId)).budder;
    const chatLog = this.chatRepository.create({
      sender: userId,
      receiver: budderId,
      timestamp: new Date(),
      ...message,
    });

    return this.chatRepository.save(chatLog).catch((err) => {
      console.error(err);
      throw new NotAcceptableException();
    });
  }

  async messageToBuddy(
    message: { text?: string; image?: string },
    userId: string,
  ) {
    const buddyId = (await this.userService.findOne(userId)).buddy;
    const chatLog = this.chatRepository.create({
      sender: userId,
      receiver: buddyId,
      timestamp: new Date(),
      ...message,
    });
    return this.chatRepository.save(chatLog).catch((err) => {
      console.error(err);
      throw new NotAcceptableException();
    });
  }

  async fetchBudderMessage(userId: string, offset?: number) {
    const budderId = (await this.userService.findOne(userId)).budder;
    return this.chatRepository
      .find({
        where: [
          { sender: userId, receiver: budderId },
          { sender: budderId, receiver: userId },
        ],
        order: { timestamp: 'desc' },
        take: 50,
        skip: offset,
      })
      .then((chats) => chats.reverse());
  }

  async fetchBuddyMessage(userId: string, offset?: number) {
    const buddyId = (await this.userService.findOne(userId)).buddy;
    return this.chatRepository
      .find({
        where: [
          { sender: userId, receiver: buddyId },
          { sender: buddyId, receiver: userId },
        ],
        order: { timestamp: 'desc' },
        take: 50,
        skip: offset,
      })
      .then((chats) => chats.reverse());
  }

  async broadcastMessage(message: Chat, userId: string) {
    const dkey = await this.userService.getDKey(userId);
    const data = this.authService.encodeLocalCipher(message, dkey);
    return { userId, data };
  }
}
