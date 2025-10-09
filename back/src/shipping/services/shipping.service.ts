import { Injectable } from '@nestjs/common';

import { TransportMethodsResponseDto } from '../dto/transport-methods-response.dto';
import { TransportMethods } from '../../shared/enums/transport-methods.enum';

@Injectable()
export class ShippingService {
  getTransportMethods(): TransportMethodsResponseDto {
    return {
      transportMethods: [
        {
          type: TransportMethods.AIR,
          name: 'Air',
          estimatedDeliveryTimeInDays: [1, 2]
        },
        {
          type: TransportMethods.SEA,
          name: 'Sea',
          estimatedDeliveryTimeInDays: [5, 10]
        },
        {
          type: TransportMethods.ROAD,
          name: 'Road',
          estimatedDeliveryTimeInDays: [3, 7]
        },
        {
          type: TransportMethods.RAIL,
          name: 'Rail',
          estimatedDeliveryTimeInDays: [4, 8]
        }
      ]
    };
  }
}
