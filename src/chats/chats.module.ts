import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsGateway } from './chats.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './chats.models';
import { UsersModule } from 'src/users/users.module';
import { User } from 'src/users/user.model';
import { AuthModule } from 'src/auth/auth.module';
import { ChatsController } from './chats.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Chat, User]), UsersModule, AuthModule],
  providers: [ChatsGateway, ChatsService],
  exports: [ChatsService],
  controllers: [ChatsController],
})
export class ChatsModule {}
