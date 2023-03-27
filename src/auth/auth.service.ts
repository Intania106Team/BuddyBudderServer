import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { createCipheriv, createDecipheriv } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  toJwt(payload: any) {
    return this.jwtService.sign(payload);
  }

  encodeCipher(payload: any) {
    if (typeof payload !== 'string') payload = JSON.stringify(payload);
    const cipher = createCipheriv(
      'aes-256-ecb',
      this.configService.get('cipherkey'),
      '',
    );
    return Buffer.from([...cipher.update(payload), ...cipher.final()]).toString(
      'base64',
    );
  }

  encodeLocalCipher(payload: any, cipherkey: string) {
    if (typeof payload !== 'string') payload = JSON.stringify(payload);
    const cipher = createCipheriv('aes-256-ecb', cipherkey, '');
    return Buffer.from([...cipher.update(payload), ...cipher.final()]).toString(
      'base64',
    );
  }

  decodeCipher(payload: string) {
    const cipher = createDecipheriv(
      'aes-256-ecb',
      this.configService.get('cipherkey'),
      '',
    );
    try {
      return Buffer.from([
        ...cipher.update(Buffer.from(payload, 'base64')),
        ...cipher.final(),
      ]).toString();
    } catch {
      throw new BadRequestException('Invlid Header');
    }
  }
}
