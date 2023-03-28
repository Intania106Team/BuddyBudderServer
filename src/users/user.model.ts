import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  userId: string;

  @Column('varchar')
  studentId: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  group: string;

  @Column({ type: 'varchar', nullable: true })
  key: string;

  @Column({ type: 'varchar' })
  codename: string;

  @Column({ type: 'text' })
  hint: string;

  @Column({ type: 'text' })
  words: string;

  @Column({ type: 'text' })
  desire: string;

  @Column({ type: 'text' })
  allergic: string;

  @Column({ type: 'varchar', nullable: true, array: true })
  interests: string[];

  @Column({ type: 'varchar', nullable: true })
  ig: string;

  @Column({ type: 'varchar', nullable: true })
  line: string;

  @Column({ type: 'varchar' })
  depart: string;

  @Column({ type: 'uuid' })
  buddy: string;

  @Column({ type: 'uuid' })
  budder: string;

  @Column({ type: 'varchar' })
  pinCode: string;

  @Column({ type: 'varchar' })
  chain: number;

  @Column({ default: true, type: 'boolean' })
  isActive: boolean;
}
