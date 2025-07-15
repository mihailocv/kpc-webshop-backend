// src/auth/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private usersService: UsersService,
    private configService: ConfigService,
  ) {
    // Prvo dohvatimo JWT_SECRET
    const jwtSecret = configService.get<string>('JWT_SECRET');

    // Proverimo da li tajni ključ uopšte postoji u konfiguraciji
    if (!jwtSecret) {
      throw new Error('JWT_SECRET nije definisan u .env fajlu!');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // Preporučeno je da se ostavi na false
      secretOrKey: jwtSecret, // Sada smo sigurni da jwtSecret nije undefined
    });
  }

  async validate(payload: { id: string }): Promise<User> {
    const { id } = payload;
    const user = await this.usersService.findOne(id);

    if (!user) {
      throw new UnauthorizedException('Neautorizovan pristup.');
    }

    return user;
  }
}