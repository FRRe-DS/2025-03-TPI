import { IsDateString, IsEnum, IsNotEmpty, IsString} from 'class-validator';
import { ShippingStatus } from '../../shared/enums/shipping-status.enum';

//TODO Implementar el log de modificaciones del shipment
export class ShippingLogDto {
  
  @IsDateString({}, { message: 'The field "timestamp" must be a valid ISO 8601 date string' })
  @IsNotEmpty({ message: 'The field "timestamp" cannot be empty' })
  timestamp: string;
  
  @IsEnum(ShippingStatus, { message: 'The field "status" must be a valid value from the following: ' + Object.values(ShippingStatus).join(', ') })
  @IsNotEmpty({ message: 'The field "status" cannot be empty' })
  status: ShippingStatus;
  
  @IsString({ message: 'The field "message" must be a string' })
  @IsNotEmpty({ message: 'The field "message" cannot be empty' })
  message: string;
}