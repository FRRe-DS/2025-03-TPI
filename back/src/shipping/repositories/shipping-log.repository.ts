import { ShipmentDomain } from "../domain/shipment";
import { ShippingLogDomain } from "../domain/shipping-log";

export default abstract class ShippingLogRepository {
    abstract create(shipment:ShipmentDomain):Promise<ShippingLogDomain>;
    abstract save (shippingLog: ShippingLogDomain):Promise<ShippingLogDomain>;
    abstract count(): Promise<number>
    abstract findByShipmentId(shipmentId: number): Promise<ShippingLogDomain[]>;
}