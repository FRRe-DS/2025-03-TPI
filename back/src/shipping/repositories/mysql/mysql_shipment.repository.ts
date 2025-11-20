import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Shipment } from "../../entities/shipment.entity";
import ShipmentRepository from "../shipment.repository";
import { MysqlCancelShipmentRepository } from './mysql_cancel_shipment.repository';

@Injectable()
export class MysqlShipmentRepository extends ShipmentRepository {
    constructor(
        @InjectRepository(Shipment)
        private readonly shipmentRepository: Repository<Shipment>,
        private readonly cancelShipmentRepository: MysqlCancelShipmentRepository,
    ) {
        super();
    }

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
    
    async findAll(page: number, itemsPerPage: number): Promise<[Shipment[], number]> {
        const skip = (page - 1) * itemsPerPage;

        return await this.shipmentRepository.findAndCount({
            relations: [
                'user',
                'originAddress',
                'destinationAddress',
                'transportMethod',
                'shipmentProducts',
                'shipmentProducts.product',
                'logs'
            ],
            skip,
            take: itemsPerPage,
            order: {
                createdAt: 'DESC',
            },
        });
    }
}