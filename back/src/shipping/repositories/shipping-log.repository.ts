import { Shipment } from "../entities/shipment.entity";
import { ShippingLog } from "../entities/shipping-log.entity";

export default abstract class ShippingLogRepository {
    abstract create(shipment:Shipment):ShippingLog;
    abstract save (shippingLog: ShippingLog):Promise<ShippingLog>;
    abstract findByShipmentId(shipmentId: number): Promise<ShippingLog[]>;
}