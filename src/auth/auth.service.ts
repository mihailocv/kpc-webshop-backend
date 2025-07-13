import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../users/entities/user.entity';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { SignUpDto } from './dto/signup.dto';
import { LogInDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const { username, password, phoneNumber } = signUpDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userModel.create({
      username,
      password: hashedPassword,
      phoneNumber,
    });

    await user.save();

    const token = this.jwtService.sign(
      { id: user.id },
      {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: this.configService.get('JWT_EXPIRES'),
      },
    );

    return { token };
  }

  async login(loginDto: LogInDto) {
    const { username, password } = loginDto;
    const user = await this.userModel.findOne({
      username,
    });

    if (!user) throw new UnauthorizedException('invalid username or password');
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch)
      throw new UnauthorizedException('invalid email or password');
    const token = this.jwtService.sign(
      { id: user.id },
      {
        secret: this.configService.get('JWT_SECRET'),
      },
    );
    return { token };
  }
}
