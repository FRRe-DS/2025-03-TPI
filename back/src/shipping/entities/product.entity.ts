import { Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ShipmentProduct } from './shipment-product.entity';

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(() => ShipmentProduct, (shipmentProduct) => shipmentProduct.product)
    shipmentProducts: ShipmentProduct[];
}