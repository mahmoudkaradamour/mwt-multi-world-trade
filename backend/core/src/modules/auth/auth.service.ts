import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  private users: any[] = [];

  async register(dto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = {
      id: Date.now().toString(),
      email: dto.email,
      password: hashedPassword,
    };

    this.users.push(user);

    return {
      message: 'User registered',
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }

  async login(dto: LoginDto) {
    const user = this.users.find((u) => u.email === dto.email);

    if (!user) {
      return {
        message: 'User not found',
      };
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      return {
        message: 'Invalid credentials',
      };
    }

    const payload = {
      sub: user.id,
      email: user.email,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      message: 'Login success',
      access_token: accessToken,
    };
  }
}