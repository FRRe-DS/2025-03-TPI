import { Injectable, ExecutionContext, Logger } from '@nestjs/common';
import { ResourceGuard } from 'nest-keycloak-connect';

@Injectable()
export class KeycloakResourceGuard extends ResourceGuard {
  private readonly customLogger = new Logger(KeycloakResourceGuard.name);

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const isValid = await super.canActivate(context);
      
      if (isValid) {
        this.customLogger.log('Token validation passed with standard validation');
        return true;
      }
      
      return false
      
    } catch (error) {
      this.customLogger.error('Error in token validation:', error.message);
      return false;
    }
  }
}