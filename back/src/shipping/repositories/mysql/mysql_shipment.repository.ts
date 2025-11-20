import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Shipment } from "../../entities/shipment.entity";
import { ShippingLog } from "../../entities/shipping-log.entity";
import { ShippingStatus } from "../../../shared/enums/shipping-status.enum";
import ShipmentRepository from "../shipment.repository";

@Injectable()
export class MysqlShipmentRepository extends ShipmentRepository {
    constructor(
        @InjectRepository(Shipment)
        private readonly shipmentRepository: Repository<Shipment>,
        @InjectRepository(ShippingLog)
        private readonly shippingLogRepository: Repository<ShippingLog>,
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

    async cancelById(id: number): Promise<void> {
        const shipment = await this.shipmentRepository.findOne({
            where: { id },
        });

        if (!shipment) {
            return;
        }

        // Actualizar el estado del shipment
        shipment.status = ShippingStatus.CANCELLED;
        shipment.updatedAt = new Date();
        await this.shipmentRepository.save(shipment);

        // Crear log de cancelación
        const shippingLog = this.shippingLogRepository.create({
            shipment: shipment,
            status: ShippingStatus.CANCELLED,
            message: 'Orden de envío cancelada',
            timestamp: new Date(),
        });
        await this.shippingLogRepository.save(shippingLog);
    }
}