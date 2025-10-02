import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Comienza el backend del TPI Desarrollo!';
  }
}
