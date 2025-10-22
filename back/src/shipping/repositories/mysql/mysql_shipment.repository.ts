import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Shipment } from "../../entities/shipment.entity";
import ShipmentRepository from "../shipment.repository";

@Injectable()
export default class MySqlShipmentRepository implements ShipmentRepository {
    constructor(
        @InjectRepository(Shipment)
        private readonly shipmentRepository: Repository<Shipment>
    ) { }

    async createShipment(shipment: Partial<Shipment>): Promise<Shipment> {
        const newShipment = this.shipmentRepository.create(shipment);
        return await this.shipmentRepository.save(newShipment);
    }

    async findShipmentById(id: number): Promise<Shipment | null> {
        return await this.shipmentRepository.findOne({
            where: { id },
            relations: ['user', 'transportMethod', 'originAddress', 'destinationAddress', 'shipmentProducts', 'shipmentProducts.product']
        });
    }
}