import { Product } from "../entities/product.entity";
import { ShipmentProduct } from "../entities/shipment-product.entity";
import { Shipment } from "../entities/shipment.entity";

export default abstract class ShipmentProductRepository{
    abstract create(shipment: Shipment, product:Product,quantity:number): Promise<ShipmentProduct>;
    abstract save(shipmentProduct: ShipmentProduct): Promise<ShipmentProduct>
    abstract count(): Promise<number>;
}