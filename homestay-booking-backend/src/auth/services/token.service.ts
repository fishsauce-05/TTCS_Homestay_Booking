import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  generateAccessToken(userId: string, email: string, role: string): string {
    const payload = {
      sub: userId,
      email,
      role,
    };
    return this.jwtService.sign(payload);
  }

  decodeToken(token: string): any {
    return this.jwtService.decode(token);
  }
}
