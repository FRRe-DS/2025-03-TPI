import { ShipmentDomain } from "../domain/shipment";
import { TransportMethodDomain } from "../domain/transport-method";
import { UserDomain } from "../domain/user";
import { AddressDomain } from "src/shipping/domain/address";
import { ShippingStatus } from "../../shared/enums/shipping-status.enum";


export default abstract class ShipmentRepository {
    abstract createShipment(user:UserDomain, orderId:number, originAddress:AddressDomain, destinationAddress:AddressDomain,transport_method:TransportMethodDomain,totalCost:number,trackingNumber:string,carrierName:string): Promise<ShipmentDomain>;
    abstract findShipmentById(id: number): Promise<ShipmentDomain | null>;
    abstract findAll(page: number, itemsPerPage: number): Promise<[ShipmentDomain[], number]>;
    abstract cancelById(id: number): Promise<void>;
    abstract updateStatus(id: number, newStatus: ShippingStatus, message: string): Promise<ShipmentDomain>;
    abstract count(): Promise<number>;
}