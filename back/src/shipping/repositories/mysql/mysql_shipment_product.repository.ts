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

    async create(shipment: Shipment, product:Product, quantity:number): Promise<ShipmentProduct> {
        
        const newShipmentProduct = this.shipmentproductRepository.create({
            shipment: shipment,
            product: product,
            quantity: quantity
        });

        return await this.shipmentproductRepository.save(newShipmentProduct);
    }

    async save(shipmentProduct:ShipmentProduct): Promise<ShipmentProduct>{
        return this.shipmentproductRepository.save(shipmentProduct)
    }

    async count(): Promise<number> {
        return this.shipmentproductRepository.count();
    }
}