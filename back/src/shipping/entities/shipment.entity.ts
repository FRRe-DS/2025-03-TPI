import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    ManyToOne,
    OneToMany,
    JoinColumn,
} from 'typeorm';
import { ShippingStatus } from '../../shared/enums/shipping-status.enum';
import { Address } from './address.entity';
import { User } from './user.entity';
import { TransportMethod } from './transport-method.entity';
import { ShipmentProduct } from './shipment-product.entity';
import { ShippingLog } from './shipping-log.entity';
import { ShipmentDomain } from '../domain/shipment';

@Entity('shipments')
export class Shipment implements ShipmentDomain {
    @PrimaryGeneratedColumn()
    id: number;

    // Agregado: order_id que falta en la entidad
    @Column({ type: 'int', nullable: true, name: 'order_id' })
    orderId: number;

    // Relación muchos a uno con User (cada envío pertenece a un usuario)
    @ManyToOne(() => User, (user) => user.shipments, { eager: true })
    @JoinColumn({ name: 'userId' })
    user: User;

    // Relación muchos a uno con Address (origen)
    @ManyToOne(() => Address, { eager: true })
    @JoinColumn({ name: 'origin_address_id' })
    originAddress: Address;

    // Relación muchos a uno con Address (destino)
    @ManyToOne(() => Address, { eager: true })
    @JoinColumn({ name: 'destination_address_id' })
    destinationAddress: Address;

    @Column({ type: 'enum', enum: ShippingStatus, default: ShippingStatus.CREATED })
    status: ShippingStatus;

    // Relación muchos a uno con TransportMethod
    @ManyToOne(() => TransportMethod, (transportMethod) => transportMethod.shipments, { eager: true })
    @JoinColumn({ name: 'transportMethodId' })
    transportMethod: TransportMethod;

    // Agregado: tracking_number que falta en la entidad
    @Column({ type: 'varchar', length: 100, nullable: true, name: 'tracking_number' })
    trackingNumber: string;

    // Agregado: carrier_name que falta en la entidad
    @Column({ type: 'varchar', length: 100, nullable: true, name: 'carrier_name' })
    carrierName: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    totalCost: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
    createdAt: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'updated_at' })
    updatedAt: Date;

    // Relación uno a muchos con ShipmentProduct (tabla intermedia)
    @OneToMany(() => ShipmentProduct, (shipmentProduct) => shipmentProduct.shipment)
    shipmentProducts: ShipmentProduct[];

    // Relación uno a muchos con ShippingLog (historial de cambios)
    @OneToMany(() => ShippingLog, (log) => log.shipment, { cascade: true })
    logs: ShippingLog[];
}