import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from "../../entities/product.entity";
import { ShipmentProduct } from "../../entities/shipment-product.entity";
import { Shipment } from "../../entities/shipment.entity";
import ShipmentProductRepository from '../shipment_product.repository';

@Injectable()
export default class MySqlShipmentProductRepository implements ShipmentProductRepository {
    constructor(
        @InjectRepository(ShipmentProduct)
        private readonly shipmentproductRepository: Repository<ShipmentProduct>,
    ) {}

    create(shipment: Shipment, product:Product,quantity:number): ShipmentProduct{
        return this.shipmentproductRepository.create({
            shipment: shipment,
            product: product,
            quantity: quantity
        })
    }

    async save(shipmentProduct:ShipmentProduct): Promise<ShipmentProduct>{
        return this.shipmentproductRepository.save(shipmentProduct)
    }
}