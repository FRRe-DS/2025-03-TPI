import { ProductDomain } from "../domain/product";
import { ShipmentProductDomain } from "../domain/shipment-product";
import { ShipmentDomain } from "../domain/shipment";

export default abstract class ShipmentProductRepository{
    abstract create(shipment: ShipmentDomain, product:ProductDomain,quantity:number): Promise<ShipmentProductDomain>;
    abstract save(shipmentProduct: ShipmentProductDomain): Promise<ShipmentProductDomain>
    abstract count(): Promise<number>;
}