import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

@Injectable()
export class GatewayService {
  private readonly services = {
    shipping: process.env.SHIPPING_SERVICE_URL || 'http://localhost:3001',
    // Puedes agregar más servicios aquí en el futuro
    // Revisar sobre que puertos vamos a levantar nuestro servicio 
  };

  constructor(private readonly httpService: HttpService) {}

  /**
   * Reenvía una petición HTTP al servicio correspondiente
   * @param service - Nombre del servicio al que se reenvía la petición
   * @param path - Ruta del endpoint dentro del servicio
   * @param method - Método HTTP (GET, POST, PUT, DELETE, etc.)
   * @param data - Cuerpo de la petición (para POST, PUT, PATCH)
   * @param headers - Headers de la petición original
   * @param queryParams - Parámetros de query string
   * @returns Respuesta del servicio
   */
  async forwardRequest(
    service: string,
    path: string,
    method: string,
    data?: any,
    headers?: any,
    queryParams?: any,
  ): Promise<{ status: number; data: any; headers: any }> {
    const serviceUrl = this.services[service];
    
    if (!serviceUrl) {
      throw new HttpException(
        `Service ${service} not configured`,
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }

    // Construir la URL completa
    const url = `${serviceUrl}${path}`;
    
    // Filtrar headers que no deben reenviarse
    const filteredHeaders = this.filterHeaders(headers);

    try {
      const response = await firstValueFrom(
        this.httpService.request({
          method,
          url,
          data,
          headers: filteredHeaders,
          params: queryParams,
          timeout: 60000, // 60 segundos de timeout
        }),
      );

      return {
        status: response.status,
        data: response.data,
        headers: response.headers,
      };
    } catch (error) {
      // Manejo de errores de Axios
      if (error instanceof AxiosError) {
        const status = error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
        const message = error.response?.data || { 
          message: 'Error communicating with service',
          error: error.message,
        };
        
        throw new HttpException(message, status);
      }

      // Error genérico
      throw new HttpException(
        'Unexpected error occurred',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Filtra headers que no deben reenviarse al servicio
   * @param headers - Headers originales
   * @returns Headers filtrados
   */
  private filterHeaders(headers: any): any {
    const headersToRemove = [
      'host',
      'connection',
      'content-length',
      'accept-encoding',
    ];

    const filtered = { ...headers };
    
    headersToRemove.forEach(header => {
      delete filtered[header];
      delete filtered[header.toLowerCase()];
    });

    return filtered;
  }

  /**
   * Verifica si un servicio está disponible
   * @param service - Nombre del servicio
   * @returns true si el servicio está configurado
   */
  isServiceAvailable(service: string): boolean {
    return !!this.services[service];
  }

  /**
   * Obtiene la lista de servicios disponibles
   * @returns Array con los nombres de los servicios
   */
  getAvailableServices(): string[] {
    return Object.keys(this.services);
  }
}
