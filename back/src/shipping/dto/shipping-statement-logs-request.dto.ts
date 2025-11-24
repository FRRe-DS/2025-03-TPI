import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ShippingStatus } from '../../shared/enums/shipping-status.enum';

/**
 * DTO para solicitar la actualización del estado de un envío
 * Este DTO se utiliza para registrar cambios de estado como logs
 * El orderId se obtiene del parámetro de ruta, no del body
 */
export class ShippingStatementLogsRequestDto {
  
  @IsEnum(ShippingStatus, { 
    message: 'The field "newStatus" must be a valid value from the following: ' + Object.values(ShippingStatus).join(', ') 
  })
  @IsNotEmpty({ message: 'The field "newStatus" cannot be empty' })
  newStatus!: ShippingStatus;
  
  @IsString({ message: 'The field "notes" must be a string' })
  @IsOptional()
  notes?: string;
}