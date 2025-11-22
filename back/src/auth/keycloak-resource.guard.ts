import { Injectable, ExecutionContext, Logger, UnauthorizedException } from '@nestjs/common';
import { ResourceGuard } from 'nest-keycloak-connect';

@Injectable()
export class KeycloakResourceGuard extends ResourceGuard {
  private readonly customLogger = new Logger(KeycloakResourceGuard.name);

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
      this.customLogger.log('Resource access granted via API key');
      return true;
    }

    try {
      const isValid = await super.canActivate(context);
      if (isValid) {
        this.customLogger.log('Token validation passed with standard validation');
        return true;
      }
      throw new UnauthorizedException();
    } catch (error) {
      this.customLogger.error('[KeycloakResourceGuard] - Authentication error:', error.message);
      throw new UnauthorizedException('Authentication failed', error.message);
    }
  }
}