import { TransportMethods } from '../../shared/enums/transport-methods.enum';
import { ShipmentDomain } from './shipment';

export class TransportMethodDomain {
    id: number;
    name: string;
    type: TransportMethods;
    estimatedDays: string;
    shipments: ShipmentDomain[];
}
