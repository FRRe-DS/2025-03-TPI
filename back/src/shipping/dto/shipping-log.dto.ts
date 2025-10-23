import { IsDateString, IsEnum, IsNotEmpty, IsString} from 'class-validator';
import { ShippingStatus } from '../../shared/enums/shipping-status.enum';

//TODO Implementar el log de modificaciones del shipment
export class ShippingLogDto {
  
  @IsDateString()
  @IsNotEmpty()
  timestamp: string;
  
  @IsEnum(ShippingStatus)
  @IsNotEmpty()
  status: ShippingStatus;
  
  @IsString()
  @IsNotEmpty()
  message: string;
}