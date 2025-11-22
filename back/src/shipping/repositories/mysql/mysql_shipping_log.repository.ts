import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShippingLog } from "src/shipping/entities/shipping-log.entity"
import ShippingLogRepository from "../shipping-log.repository"
import { Shipment } from 'src/shipping/entities/shipment.entity';
import { ShippingStatus } from 'src/shared/enums/shipping-status.enum';


@Injectable()
export default class MySqlShippingLogRepository implements ShippingLogRepository {
    constructor(
        @InjectRepository(ShippingLog)
        private readonly shipmentproductRepository: Repository<ShippingLog>,
    ) { }

    create(shipment: Shipment): ShippingLog {
        return this.shipmentproductRepository.create({
            shipment: shipment,
            status: ShippingStatus.CREATED,
            message: 'Orden de envío creada',
            timestamp: new Date()
        })
    }

    async save(shippinglog: ShippingLog): Promise<ShippingLog> {
        return this.shipmentproductRepository.save(shippinglog)
    }

    async findByShipmentId(shipmentId: number): Promise<ShippingLog[]> {
        return this.shipmentproductRepository.find({
            where: { shipmentId },
            order: { timestamp: 'ASC' }
        });
    }
}




