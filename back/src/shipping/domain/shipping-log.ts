import { ShippingStatus } from '../../shared/enums/shipping-status.enum';
import { ShipmentDomain } from './shipment';

export class ShippingLogDomain {
    id: number;
    shipmentId: number;
    shipment: ShipmentDomain
    timestamp: Date;
    status: ShippingStatus;
    message: string;
}
