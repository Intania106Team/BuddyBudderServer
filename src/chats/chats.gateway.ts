import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'typeorm';
import { ChatsService } from './chats.service';

@WebSocketGateway(5500, { cors: { origin: '*' }, namespace: 'chats' })
export class ChatsGateway {
  constructor(private readonly chatsService: ChatsService) {}
  @WebSocketServer() server: Server;

  @SubscribeMessage('budder')
  async sendBudderMessage(
    @MessageBody('tid') tid: string,
    @MessageBody('userId') userId: string,
    @MessageBody('text') text?: string,
    @MessageBody('image') image?: string,
  ): Promise<string> {
    return this.chatsService
      .messageToBudder({ text, image }, userId)
      .then((chat) => {
        console.log(`${chat.receiver}-buddy`, chat);
        this.server.emit(`${chat.receiver}-buddy`, chat);
        return JSON.stringify({
          tid,
          code: 0,
          mid: chat.messageId,
        });
      })
      .catch((err) => {
        console.error(err);
        return JSON.stringify({ tid, code: 1 });
      });
  }

  @SubscribeMessage('buddy')
  async sendBuddyMessage(
    @MessageBody('tid') tid: string,
    @MessageBody('userId') userId: string,
    @MessageBody('text') text?: string,
    @MessageBody('image') image?: string,
  ): Promise<string> {
    return this.chatsService
      .messageToBuddy({ text, image }, userId)
      .then((chat) => {
        console.log(`${chat.receiver}-budder`, chat);
        this.server.emit(`${chat.receiver}-budder`, chat);
        return JSON.stringify({
          tid,
          code: 0,
          mid: chat.messageId,
        });
      })
      .catch(() => JSON.stringify({ tid, code: 1 }));
  }
}
