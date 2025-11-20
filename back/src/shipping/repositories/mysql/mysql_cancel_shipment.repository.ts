import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shipment } from '../../entities/shipment.entity';
import { ShippingStatus } from '../../../shared/enums/shipping-status.enum';
import { ShippingLog } from '../../entities/shipping-log.entity';

@Injectable()
export class MysqlCancelShipmentRepository {
    constructor(
        @InjectRepository(Shipment)
        private readonly shipmentRepository: Repository<Shipment>,
        @InjectRepository(ShippingLog)
        private readonly shippingLogRepository: Repository<ShippingLog>,
    ) { }

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