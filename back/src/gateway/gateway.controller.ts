import {
  Controller,
  All,
  Req,
  Res,
  HttpStatus,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { Public } from 'nest-keycloak-connect';
import { GatewayService } from './gateway.service';

@Controller()
export class GatewayController {
  constructor(private readonly gatewayService: GatewayService) {}

  /**
   * Endpoint de prueba del Gateway
   */
  @All('gateway/health')
  @Public()
  async healthCheck() {
    return {
      status: 'ok',
      message: 'API Gateway is running',
      services: this.gatewayService.getAvailableServices(),
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Maneja todas las peticiones hacia el servicio de shipping
   * Rutas soportadas:
   * - GET/POST /api/shipping/*
   * - Reenvía al servicio de shipping manteniendo headers, query params y body
   */
  @All('shipping*')
  async handleShippingRequests(@Req() req: Request, @Res() res: Response) {
    // Extraer el path después de /shipping
    const path = req.url.replace(/^\/shipping/, '/shipping');
    
    try {
      const result = await this.gatewayService.forwardRequest(
        'shipping',
        path,
        req.method,
        req.body,
        req.headers,
        req.query,
      );
      
      // Reenviar los headers de respuesta si existen
      if (result.headers) {
        Object.keys(result.headers).forEach(key => {
          res.setHeader(key, result.headers[key]);
        });
      }

      return res.status(result.status).json(result.data);
    } catch (error) {
      const status = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
      const message = error.response || error.message || 'Internal server error';
      
      return res.status(status).json(message);
    }
  }

  // Puedes agregar más handlers para otros servicios aquí
}
