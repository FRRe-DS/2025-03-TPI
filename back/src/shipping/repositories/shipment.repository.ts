import { Shipment } from "../entities/shipment.entity";
import { TransportMethod } from "../entities/transport-method.entity";
import { User } from "../entities/user.entity";
import { Address } from "src/shipping/entities/address.entity";


export default abstract class ShipmentRepository {
    abstract createShipment(user:User, orderId:number, originAddress:Address, destinationAddress:Address,transport_method:TransportMethod,totalCost:number,trackingNumber:string,carrierName:string): Promise<Shipment>;
    abstract findShipmentById(id: number): Promise<Shipment | null>;
    abstract findAll(page: number, itemsPerPage: number): Promise<[Shipment[], number]>;
    abstract cancelById(id: number): Promise<void>;
    abstract count(): Promise<number>;
}