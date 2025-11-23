import { Shipment } from "../entities/shipment.entity";
import { ShippingLog } from "../entities/shipping-log.entity";

export default abstract class ShippingLogRepository {
    abstract create(shipment:Shipment):Promise<ShippingLog>;
    abstract save (shippingLog: ShippingLog):Promise<ShippingLog>;
    abstract count(): Promise<number>
    abstract findByShipmentId(shipmentId: number): Promise<ShippingLog[]>;
}