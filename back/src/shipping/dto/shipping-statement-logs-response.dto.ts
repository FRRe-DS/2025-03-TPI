import { IsArray, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ShippingStatus } from '../../shared/enums/shipping-status.enum';
import { ShippingLogDto } from './shipping-log.dto';

/**
 * DTO de respuesta para la actualización del estado de un envío
 * Incluye el estado actual, el historial de cambios y los estados permitidos siguientes
 */
export class ShippingStatementLogsResponseDto {
  
  @IsString({ message: 'The field "orderId" must be a string' })
  @IsNotEmpty({ message: 'The field "orderId" cannot be empty' })
  orderId: string;
  
  @IsEnum(ShippingStatus, { 
    message: 'The field "currentStatus" must be a valid value from the following: ' + Object.values(ShippingStatus).join(', ') 
  })
  @IsNotEmpty({ message: 'The field "currentStatus" cannot be empty' })
  currentStatus: ShippingStatus;
  
  @IsArray({ message: 'The field "statusHistory" must be an array' })
  @IsNotEmpty({ message: 'The field "statusHistory" cannot be empty' })
  statusHistory: ShippingLogDto[];
  
  @IsArray({ message: 'The field "allowedNextStatuses" must be an array' })
  @IsNotEmpty({ message: 'The field "allowedNextStatuses" cannot be empty' })
  allowedNextStatuses: ShippingStatus[];
}
