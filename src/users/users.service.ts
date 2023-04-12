import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { FindOptionsSelect, Repository } from 'typeorm';
import { User } from './user.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly authService: AuthService,
  ) {}

  findOne(userId: string): Promise<User> {
    return this.usersRepository.findOneBy({ userId });
  }

  findByStudentId(studentId: string, select?: FindOptionsSelect<User>) {
    return this.usersRepository.findOne({ where: { studentId }, select });
  }

  async login(studentId: string, pin: string) {
    return this.findByStudentId(studentId, {
      pinCode: true,
      name: true,
      userId: true,
    })
      .then((user) => {
        if (!user) return { code: 2 };
        if (user.pinCode == pin) {
          return {
            code: 0,
            data: {
              name: user.name,
              userId: user.userId,
              u: this.authService.encodeCipher({
                u: user.userId,
                t: Date.now(),
              }),
            },
          };
        }
        return { code: 1 };
      })
      .catch((err) => {
        console.error(err);
        return { code: -1 };
      });
  }

  async getUser(key: string) {
    if (!key) throw new UnauthorizedException();
    const decoded = this.authService.decodeCipher(key);
    if (!decoded) throw new UnauthorizedException();
    const u = JSON.parse(decoded) as {
      u: string;
      t: number;
    };
    return this.findOne(u.u)
      .then((user) => ({ user, time: u.t }))
      .catch((err) => {
        console.error(err);
        throw err;
      });
  }

  async getBudderUserId(key: string) {
    const userId = await this.getUser(key)
      .catch((err) => {
        throw err;
      })
      .then((user) => user.user.userId);
    return this.usersRepository
      .findOne({
        where: {
          userId,
        },
        select: { budder: true },
      })
      .then(async (user) => {
        const budder = await this.findOne(user.budder).catch((err) => {
          console.error(err);
          throw new BadRequestException();
        });
        const codename = budder ? budder.codename : undefined;
        return {
          userId: user.budder,
          codename,
          hint: budder ? budder.hint : undefined,
          interests: budder ? budder.interests : undefined,
        };
      })
      .catch((err) => {
        console.error(err);
        throw new BadRequestException();
      });
  }

  async getBuddyUserId(key: string) {
    const userId = await this.getUser(key)
      .catch((err) => {
        throw err;
      })
      .then((user) => user.user.userId);
    return this.usersRepository
      .findOne({
        where: {
          userId,
        },
        select: { buddy: true },
      })
      .then(async (user) => {
        const buddy = await this.findOne(user.buddy).catch((err) => {
          console.error(err);
          throw new BadRequestException();
        });
        const codename = buddy ? buddy.codename : undefined;
        return {
          userId: user.buddy,
          codename,
          group: buddy ? buddy.group : undefined,
          name: buddy ? buddy.name : undefined,
          desire: buddy ? buddy.desire : undefined,
          words: buddy ? buddy.words : undefined,
          depart: buddy ? buddy.depart : undefined,
          interests: buddy ? buddy.interests : undefined,
          allergic: buddy ? buddy.allergic : undefined,
        };
      })
      .catch((err) => {
        console.error(err);
        throw new BadRequestException();
      });
  }

  async getDKey(userId: string) {
    return this.findOne(userId)
      .then((user) => user.key)
      .catch(() => {
        throw new NotFoundException();
      });
  }

  async remove(userId: string): Promise<void> {
    await this.usersRepository.delete(userId);
  }

  async getAllProfiles(u: string) {
    const user = (await this.getUser(u)).user;
    const buddy = await this.usersRepository.findOne({
      where: { userId: user.buddy },
    });
    const budder = await this.usersRepository.findOne({
      where: { userId: user.budder },
    });
    const circle = await this.usersRepository.find({
      where: { chain: user.chain },
      select: { hint: false },
    });

    return [
      ...circle.filter(
        (u) => ![user.userId, budder.userId, buddy.userId].includes(u.userId),
      ),
      { ...user, role: 'You', isYou: true },
      { ...budder, role: 'Budder' },
      { ...buddy, role: 'Buddy' },
    ];
  }
}
