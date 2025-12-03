import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Shipment } from './shipment.entity';
import { Product } from './product.entity';
import { ShipmentProductDomain } from '../domain/shipment-product';

@Entity('shipment_products')
export class ShipmentProduct implements ShipmentProductDomain {
    @PrimaryColumn()
    idShipment: number;

    @PrimaryColumn()
    idProduct: number;

    @Column({ type: 'int' })
    quantity: number;

    // Relación muchos a uno con Shipment
    @ManyToOne(() => Shipment, (shipment) => shipment.shipmentProducts, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'idShipment' })
    shipment: Shipment;

    // Relación muchos a uno con Product
    @ManyToOne(() => Product, (product) => product.shipmentProducts, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'idProduct' })
    product: Product;
}