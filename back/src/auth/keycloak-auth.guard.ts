import { Injectable, ExecutionContext, Logger } from '@nestjs/common';
import { AuthGuard } from 'nest-keycloak-connect';
import { UnauthorizedException } from '../common/exceptions/unauthorized.exception';

@Injectable()
export class KeycloakAuthGuard extends AuthGuard {
  private readonly customLogger = new Logger(KeycloakAuthGuard.name);

  private getApiKeyFromHeaders(headers: any): string | undefined {
    for (const headerKey in headers) {
      if (headerKey.toLowerCase() === 'x-api-key' || headerKey.toLowerCase() === 'api-key') {
        return headers[headerKey];
      }
    }
    return undefined;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const headers = request.headers || {};
    const apiKey = this.getApiKeyFromHeaders(headers);
    const secretApiKey = process.env.API_KEY_SECRET;

    if (apiKey && secretApiKey && apiKey === secretApiKey) {
      this.customLogger.log('Authentication successful via API key');
      return true;
    }

    try {
      const isValid = await super.canActivate(context);
      if (isValid) {
        this.customLogger.log('Authentication successful via Keycloak');
        return true;
      }
      throw new UnauthorizedException();
    } catch (error) {
      this.customLogger.error('[KeycloakAuthGuard] - Authentication error:', error.message);
      throw new UnauthorizedException('Authentication failed', error.message);
    }
  }
}
