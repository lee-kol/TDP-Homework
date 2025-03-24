import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}

  getWelcome(): string {
    return 'Welcome to Popcorn Palace!';
  }
}
