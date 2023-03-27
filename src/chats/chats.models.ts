import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('chats')
export class Chat {
  @PrimaryGeneratedColumn('uuid')
  messageId: string;

  @Column('uuid')
  sender: string;

  @Column('uuid')
  receiver: string;

  @Column('timestamp', { nullable: true })
  timestamp: Date;

  @Column('varchar', { nullable: true })
  text: string;

  @Column('varchar', { nullable: true })
  image: string;
}
