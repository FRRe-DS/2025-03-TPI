import { ShippingStatus } from '../../shared/enums/shipping-status.enum';

/**
 * Helper para gestionar las transiciones permitidas entre estados de envío
 * 
 * IMPORTANTE: 
 * - CANCELLED es un estado válido que aparecerá en los logs/historial
 * - Sin embargo, la transición a CANCELLED solo se permite mediante el endpoint /cancel
 * - Este helper gestiona las transiciones del flujo normal de actualización de estados
 * - El endpoint /cancel tiene su propia validación (solo desde CREATED o RESERVED)
 */
export class ShippingStatusTransitionHelper {
  
  /**
   * Mapa de transiciones permitidas mediante el endpoint de actualización de estado
   * CANCELLED no aparece aquí porque tiene su propio endpoint dedicado (/cancel)
   * con validaciones específicas
   */
  private static readonly ALLOWED_TRANSITIONS: Record<ShippingStatus, ShippingStatus[]> = {
    [ShippingStatus.CREATED]: [ShippingStatus.RESERVED, ShippingStatus.CANCELLED],
    [ShippingStatus.RESERVED]: [ShippingStatus.IN_TRANSIT, ShippingStatus.CANCELLED],
    [ShippingStatus.IN_TRANSIT]: [ShippingStatus.IN_DISTRIBUTION],
    [ShippingStatus.ARRIVED]: [ShippingStatus.DELIVERED],
    [ShippingStatus.IN_DISTRIBUTION]: [ShippingStatus.ARRIVED],
    [ShippingStatus.DELIVERED]: [], // Estado final, no hay transiciones
    [ShippingStatus.CANCELLED]: [], // Estado final, llegó aquí mediante /cancel
  };

  /**
   * Obtiene los estados permitidos siguientes desde un estado actual
   * @param currentStatus - Estado actual del envío
   * @returns Array de estados permitidos para la siguiente transición
   */
  static getAvailableNextStatuses(currentStatus: ShippingStatus): ShippingStatus[] {
    return this.ALLOWED_TRANSITIONS[currentStatus] || [];
  }

  /**
   * Valida si una transición de estado es permitida
   * @param currentStatus - Estado actual del envío
   * @param newStatus - Estado al que se quiere transicionar
   * @returns true si la transición es válida, false en caso contrario
   */
  static isValidTransition(currentStatus: ShippingStatus, newStatus: ShippingStatus): boolean {
    const allowedStatuses = this.ALLOWED_TRANSITIONS[currentStatus] || [];
    return allowedStatuses.includes(newStatus);
  }

  /**
   * Verifica si un estado es un estado final (sin transiciones posibles)
   * @param status - Estado a verificar
   * @returns true si es un estado final
   */
  static isFinalStatus(status: ShippingStatus): boolean {
    const allowedStatuses = this.ALLOWED_TRANSITIONS[status] || [];
    return allowedStatuses.length === 0;
  }
}
