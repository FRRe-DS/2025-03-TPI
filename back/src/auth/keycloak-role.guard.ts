import { Injectable, ExecutionContext, Logger } from '@nestjs/common';
import { RoleGuard } from 'nest-keycloak-connect';

@Injectable()
export class KeycloakRoleGuard extends RoleGuard {
  private readonly customLogger = new Logger(KeycloakRoleGuard.name);

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
      this.customLogger.log('Role check bypassed via API key');
      return true;
    }

    this.customLogger.log('Role check via Keycloak');
    return super.canActivate(context);
  }
}

