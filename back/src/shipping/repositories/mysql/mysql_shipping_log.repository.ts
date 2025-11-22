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
        private readonly shippingLogRepository: Repository<ShippingLog>,
    ) { }

    async create(shipment: Shipment): Promise<ShippingLog> {

        const newLog = this.shippingLogRepository.create({
            shipment: shipment,
            status: ShippingStatus.CREATED,
            message: 'Orden de envio creada',
            timestamp: new Date()
        });

        return await this.shippingLogRepository.save(newLog);
    }

    async save(shippinglog: ShippingLog): Promise<ShippingLog> {
        return this.shippingLogRepository.save(shippinglog)
    }

    async count(): Promise<number> {
        return this.shippingLogRepository.count();
    }
}




