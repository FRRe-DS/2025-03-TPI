import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ShipmentProduct } from './shipment-product.entity';

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100 })
    name: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    weight: number; // en kg

    // Relación con la tabla intermedia
    @OneToMany(() => ShipmentProduct, (shipmentProduct) => shipmentProduct.product)
    shipmentProducts: ShipmentProduct[];
}