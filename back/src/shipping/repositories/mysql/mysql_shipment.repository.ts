import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Shipment } from "../../entities/shipment.entity";
import { ShippingLog } from "../../entities/shipping-log.entity";
import { ShippingStatus } from "../../../shared/enums/shipping-status.enum";
import ShipmentRepository from "../shipment.repository";
import { TransportMethod } from "../../entities/transport-method.entity";
import { User } from "../../entities/user.entity";
import { Address } from "src/shipping/entities/address.entity";


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

    async createShipment(user: User, orderId: number, originAddress: Address, destinationAddress: Address, transport_method: TransportMethod, totalCost: number, trackingNumber: string, carrierName: string): Promise<Shipment> {
        const newShipment = this.shipmentRepository.create({
            user: user,
            orderId: orderId,
            originAddress: originAddress,
            destinationAddress: destinationAddress,
            transportMethod: transport_method,
            status: ShippingStatus.CREATED,
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

    async count(): Promise<number> {
        return await this.shipmentRepository.count();
    }
}
