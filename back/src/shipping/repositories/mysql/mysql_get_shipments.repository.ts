import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shipment } from '../../entities/shipment.entity';
import GetShipmentsRepository from '../get-shipments.repository';

@Injectable()
export class MysqlGetShipmentsRepository extends GetShipmentsRepository {
    constructor(
        @InjectRepository(Shipment)
        private readonly shipmentRepository: Repository<Shipment>,
    ) {
        super();
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

    async findById(id: number): Promise<Shipment | null> {
        const shipment = await this.shipmentRepository.findOne({
            where: { id },
            relations: [
                'user',
                'originAddress',
                'destinationAddress',
                'transportMethod',
                'shipmentProducts',
                'shipmentProducts.product',
                'logs'
            ],
        });

        return shipment || null;
    }
}