import { Injectable, ExecutionContext, Logger } from '@nestjs/common';
import { AuthGuard } from 'nest-keycloak-connect';
import { UnauthorizedException } from '../common/exceptions/unauthorized.exception';

@Injectable()
export class KeycloakAuthGuard extends AuthGuard {
  private readonly customLogger = new Logger(KeycloakAuthGuard.name);

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const isValid = await super.canActivate(context);
      
      if (isValid) {
        this.customLogger.log('Authentication successful');
        return true;
      }
      throw new UnauthorizedException();
    } catch (error) {
      this.customLogger.error('[KeycloakAuthGuard] - Authentication error:', error.message);
      throw new UnauthorizedException('Authentication failed', error.message);
    }
  }
}
