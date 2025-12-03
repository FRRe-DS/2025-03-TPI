import { ShippingStatus } from '../../shared/enums/shipping-status.enum';
import { AddressDomain } from './address';
import { UserDomain } from './user';
import { TransportMethodDomain } from './transport-method';
import { ShipmentProductDomain } from './shipment-product';
import { ShippingLogDomain } from './shipping-log';

export class ShipmentDomain {
    id: number;
    orderId: number;
    user: UserDomain;
    originAddress: AddressDomain;
    destinationAddress: AddressDomain;
    status: ShippingStatus;
    transportMethod: TransportMethodDomain;
    trackingNumber: string;
    carrierName: string;
    totalCost: number;
    createdAt: Date;
    updatedAt: Date;
    shipmentProducts: ShipmentProductDomain[];
    logs: ShippingLogDomain[];
}