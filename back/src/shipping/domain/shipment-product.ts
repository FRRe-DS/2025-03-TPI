import { ProductDomain } from './product';
import { ShipmentDomain }  from './shipment';

export class ShipmentProductDomain {
    idShipment: number;
    idProduct: number;
    quantity: number;
    shipment: ShipmentDomain;
    product: ProductDomain;
}