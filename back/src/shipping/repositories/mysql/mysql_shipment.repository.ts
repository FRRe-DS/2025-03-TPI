import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Shipment } from "../../entities/shipment.entity";
import { ShippingStatus } from "src/shared/enums/shipping-status.enum";
import ShipmentRepository from "../shipment.repository";
import { TransportMethod } from "../../entities/transport-method.entity";
import { User } from "../../entities/user.entity";
import { Address } from "src/shipping/entities/address.entity";


@Injectable()
export default class MySqlShipmentRepository implements ShipmentRepository {
    constructor(
        @InjectRepository(Shipment)
        private readonly shipmentRepository: Repository<Shipment>
    ) { }

    async createShipment(user:User, orderId:number, originAddress:Address, destinationAddress:Address,transport_method:TransportMethod,totalCost:number,trackingNumber:string,carrierName:string): Promise<Shipment> {
        const newShipment = this.shipmentRepository.create({
            user: user,
            orderId: orderId,
            originAddress: originAddress,
            destinationAddress: destinationAddress,
            transportMethod: transport_method,
            status: ShippingStatus.PENDING,
            totalCost: totalCost,
            trackingNumber: trackingNumber,
            carrierName: carrierName,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        return await this.shipmentRepository.save(newShipment);
    }

    async findShipmentById(id: number): Promise<Shipment | null> {
        return await this.shipmentRepository.findOne({
            where: { id },
            relations: ['user', 'transportMethod', 'originAddress', 'destinationAddress', 'shipmentProducts', 'shipmentProducts.product']
        });
    }
}
