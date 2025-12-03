import { Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ShipmentProduct } from './shipment-product.entity';
import { ProductDomain } from '../domain/product';

@Entity('products')
export class Product implements ProductDomain{
    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(() => ShipmentProduct, (shipmentProduct) => shipmentProduct.product)
    shipmentProducts: ShipmentProduct[];
}