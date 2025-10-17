import { Shipment } from "../entities/shipment.entity";

export default abstract class ShipmentRepository {
    abstract createShipment(shipment: Partial<Shipment>): Promise<Shipment>;
    abstract findShipmentById(id: number): Promise<Shipment | null>;
}