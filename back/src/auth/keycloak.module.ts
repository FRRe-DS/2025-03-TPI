import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { 
  KeycloakConnectModule, 
  TokenValidation, 
  AuthGuard, 
  RoleGuard 
} from 'nest-keycloak-connect';
import { KeycloakResourceGuard } from './keycloak-resource.guard';

@Module({
  imports: [
    KeycloakConnectModule.register({
      authServerUrl: 'http://localhost:8080',
      realm: 'ds-2025-realm',
      clientId: 'grupo-03',
      secret: '21cd6616-6571-4ee7-be29-0f781f77c74e',
      tokenValidation: TokenValidation.ONLINE, // Cambiar a validación online para debugging
      bearerOnly: true,
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: KeycloakResourceGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
  exports: [KeycloakConnectModule],
})
export class KeycloakModule {}
