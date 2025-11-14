import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShippingLog } from '../entities/shipping-log.entity';
import { Shipment } from '../entities/shipment.entity';
import { ShippingStatus } from '../../shared/enums/shipping-status.enum';

/**
 * Servicio dedicado para la gestión de logs de envíos y validación de transiciones de estado
 */
@Injectable()
export class ShippingLogService {
  // Configuración: ventana de gracia para cancelación en minutos
  private readonly CANCELLATION_GRACE_PERIOD_MINUTES = 30;

  constructor(
    @InjectRepository(ShippingLog)
    private readonly shippingLogRepository: Repository<ShippingLog>,
  ) {}

  /**
   * ========================================
   * MÉTODOS DE GESTIÓN DE LOGS
   * ========================================
   */

  /**
   * Crea un nuevo log de seguimiento para un envío
   */
  async createLog(
    shipment: Shipment,
    status: ShippingStatus,
    message: string,
  ): Promise<ShippingLog> {
    const log = this.shippingLogRepository.create({
      shipment: shipment,
      status: status,
      message: message,
      timestamp: new Date(),
    });

    return await this.shippingLogRepository.save(log);
  }

  /**
   * Obtiene todos los logs de un envío ordenados cronológicamente
   */
  async getLogsByShipmentId(shipmentId: number): Promise<ShippingLog[]> {
    return await this.shippingLogRepository.find({
      where: { shipmentId: shipmentId },
      order: { timestamp: 'ASC' },
    });
  }

  /**
   * ========================================
   * LÓGICA DE NEGOCIO: TRANSICIONES DE ESTADO
   * ========================================
   */

  /**
   * Define las transiciones válidas entre estados según OAS
   * Estados disponibles: created, reserved, in_transit, delivered, cancelled, in_distribution, arrived, returned
   * 
   * Estructura: { estadoActual: [estadosPermitidos] }
   */
  private readonly STATE_TRANSITIONS: Record<ShippingStatus, ShippingStatus[]> = {
    // CREATED puede ir a RESERVED o CANCELLED
    [ShippingStatus.CREATED]: [
      ShippingStatus.RESERVED,
      ShippingStatus.CANCELLED,
    ],
    
    // RESERVED puede ir a IN_TRANSIT o CANCELLED
    [ShippingStatus.RESERVED]: [
      ShippingStatus.IN_TRANSIT,
      ShippingStatus.CANCELLED,
    ],
    
    // IN_TRANSIT puede ir a IN_DISTRIBUTION o RETURNED
    // CANCELLED solo con validación especial (ventana de gracia)
    [ShippingStatus.IN_TRANSIT]: [
      ShippingStatus.IN_DISTRIBUTION,
      ShippingStatus.RETURNED,
    ],
    
    // IN_DISTRIBUTION puede ir a ARRIVED
    [ShippingStatus.IN_DISTRIBUTION]: [
      ShippingStatus.ARRIVED,
    ],
    
    // ARRIVED puede ir a DELIVERED
    [ShippingStatus.ARRIVED]: [
      ShippingStatus.DELIVERED,
    ],
    
    // Estados terminales - no permiten más transiciones
    [ShippingStatus.DELIVERED]: [],
    [ShippingStatus.CANCELLED]: [],
    [ShippingStatus.RETURNED]: [],
  };

  /**
   * Valida si una transición de estado es válida
   * Incluye lógica especial para cancelaciones
   */
  validateStatusTransition(
    currentStatus: ShippingStatus,
    newStatus: ShippingStatus,
    shipmentUpdatedAt?: Date,
  ): { valid: boolean; reason?: string } {
    // Caso especial: validar CANCELACIÓN con ventana de gracia
    if (newStatus === ShippingStatus.CANCELLED) {
      return this.validateCancellation(currentStatus, shipmentUpdatedAt);
    }

    // Validación estándar de transiciones
    const allowedTransitions = this.STATE_TRANSITIONS[currentStatus] || [];

    if (allowedTransitions.includes(newStatus)) {
      return { valid: true };
    }

    return {
      valid: false,
      reason: `No se puede cambiar de ${currentStatus} a ${newStatus}`,
    };
  }

  /**
   * ========================================
   * LÓGICA DE NEGOCIO: VALIDACIÓN DE CANCELACIÓN (Solución 1)
   * ========================================
   */

  /**
   * Valida si un envío puede ser cancelado según su estado actual
   * Reglas:
   * - CREATED o RESERVED: Siempre cancelable (con verificación de tiempo)
   * - IN_TRANSIT: Solo en ventana de gracia de 30 minutos
   * - Resto: No cancelable
   */
  private validateCancellation(
    currentStatus: ShippingStatus,
    shipmentUpdatedAt?: Date,
  ): { valid: boolean; reason?: string; requiresConfirmation?: boolean } {
    
    // Regla 1: Solo CREATED y RESERVED permiten cancelación directa
    const directlyCancellableStates = [
      ShippingStatus.CREATED,
      ShippingStatus.RESERVED,
    ];

    if (directlyCancellableStates.includes(currentStatus)) {
      // Validar que no haya pasado mucho tiempo (por ejemplo, máximo 24 horas)
      if (shipmentUpdatedAt) {
        const hoursSinceUpdate = this.getMinutesSince(shipmentUpdatedAt) / 60;
        
        // Si pasaron más de 24 horas, probablemente ya debería estar en otro estado
        if (hoursSinceUpdate > 24) {
          return {
            valid: false,
            reason: `El envío lleva ${Math.round(hoursSinceUpdate)} horas en estado ${currentStatus}. Verificar estado actual.`,
          };
        }
      }
      
      return { 
        valid: true,
        reason: `El envío en estado ${currentStatus} puede ser cancelado`
      };
    }

    // Regla 2: Estados terminales NUNCA son cancelables
    const terminalStates = [
      ShippingStatus.DELIVERED,
      ShippingStatus.CANCELLED,
      ShippingStatus.RETURNED,
    ];

    if (terminalStates.includes(currentStatus)) {
      return {
        valid: false,
        reason: `El envío está en estado ${currentStatus} y no puede ser modificado`,
      };
    }

    // Regla 3: IN_TRANSIT - solo cancelable en ventana de gracia (30 minutos)
    if (currentStatus === ShippingStatus.IN_TRANSIT) {
      if (!shipmentUpdatedAt) {
        return {
          valid: false,
          reason: 'No se puede determinar el tiempo en tránsito',
        };
      }

      const minutesSinceTransition = this.getMinutesSince(shipmentUpdatedAt);

      if (minutesSinceTransition <= this.CANCELLATION_GRACE_PERIOD_MINUTES) {
        return {
          valid: true,
          requiresConfirmation: true,
          reason: `El envío recién entró en tránsito (hace ${Math.round(minutesSinceTransition)} min). Aún puede interceptarse.`,
        };
      } else {
        return {
          valid: false,
          reason: `El envío lleva ${Math.round(minutesSinceTransition)} minutos en tránsito y no puede detenerse`,
        };
      }
    }

    // Regla 4: IN_DISTRIBUTION y ARRIVED - no cancelables
    if ([ShippingStatus.IN_DISTRIBUTION, ShippingStatus.ARRIVED].includes(currentStatus)) {
      return {
        valid: false,
        reason: `El envío está en ${currentStatus} (en proceso de entrega final) y no puede cancelarse`,
      };
    }

    // Cualquier otro estado: no cancelable por defecto
    return {
      valid: false,
      reason: `No se puede cancelar un envío en estado ${currentStatus}`,
    };
  }

  /**
   * ========================================
   * LÓGICA DE NEGOCIO: GENERACIÓN DE MENSAJES CONTEXTUALIZADOS
   * ========================================
   */

  /**
   * Genera mensajes descriptivos según la transición de estado
   */
  generateStatusMessage(
    oldStatus: ShippingStatus | null,
    newStatus: ShippingStatus,
    additionalInfo?: string,
  ): string {
    // Mensajes predefinidos por estado
    const statusMessages: Record<ShippingStatus, string> = {
      [ShippingStatus.CREATED]: 'Orden de envío registrada en el sistema',
      [ShippingStatus.RESERVED]: 'Productos reservados para el envío',
      [ShippingStatus.IN_TRANSIT]: 'Paquete en tránsito hacia su destino',
      [ShippingStatus.IN_DISTRIBUTION]: 'Paquete en el centro de distribución local',
      [ShippingStatus.ARRIVED]: 'Paquete llegó a la ciudad de destino',
      [ShippingStatus.DELIVERED]: 'Entrega exitosa confirmada',
      [ShippingStatus.CANCELLED]: 'Orden de envío cancelada',
      [ShippingStatus.RETURNED]: 'Paquete devuelto al remitente',
    };

    let message = statusMessages[newStatus] || `Estado actualizado a ${newStatus}`;

    // Agregar contexto de transición si hay estado previo
    if (oldStatus && oldStatus !== newStatus) {
      const transitionKey = `${oldStatus} → ${newStatus}`;
      const transitionMessages: Record<string, string> = {
        'created → reserved': 'Productos verificados y reservados',
        'reserved → in_transit': 'Paquete retirado por el courier',
        'in_transit → in_distribution': 'Paquete llegó al centro de distribución',
        'in_distribution → arrived': 'Paquete en la ciudad de destino, listo para entrega',
        'arrived → delivered': 'Entrega confirmada por el destinatario',
        'in_transit → returned': 'Dirección incorrecta, retorno al remitente',
        'created → cancelled': 'Cancelación procesada antes del procesamiento',
        'reserved → cancelled': 'Cancelación procesada antes del envío',
        'in_transit → cancelled': 'Envío interceptado y cancelado',
      };

      const specificMessage = transitionMessages[transitionKey.toLowerCase()];
      if (specificMessage) {
        message = specificMessage;
      } else {
        message = `Cambio de estado: ${oldStatus} → ${newStatus}. ${message}`;
      }
    }

    // Agregar información adicional si existe
    if (additionalInfo) {
      message += ` - ${additionalInfo}`;
    }

    return message;
  }

  /**
   * ========================================
   * MÉTODOS AUXILIARES
   * ========================================
   */

  /**
   * Calcula los minutos transcurridos desde una fecha
   */
  private getMinutesSince(date: Date): number {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    return diffMs / (1000 * 60); // Convertir a minutos
  }

  /**
   * Obtiene información legible sobre si un envío puede ser cancelado
   */
  canBeCancelled(shipment: Shipment): {
    cancellable: boolean;
    reason?: string;
    requiresConfirmation?: boolean;
  } {
    const validation = this.validateCancellation(shipment.status, shipment.updatedAt);
    return {
      cancellable: validation.valid,
      reason: validation.reason,
      requiresConfirmation: validation.requiresConfirmation,
    };
  }
}
