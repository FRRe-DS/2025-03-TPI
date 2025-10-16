import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ShippingStatus } from '../../shared/enums/shipping-status.enum';
import { TransportMethods } from '../../shared/enums/transport-methods.enum';

@Entity('shipments') // Nombre de la tabla en MySQL
export class Shipment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    orderId: string;

    @Column({ type: 'enum', enum: ShippingStatus, default: ShippingStatus.PENDING })
    status: ShippingStatus;

    @Column({ type: 'enum', enum: TransportMethods })
    transportMethod: TransportMethods;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    cost: number;

    @Column({ type: 'json' })
    origin: object;

    @Column({ type: 'json' })
    destination: object;

    @Column({ type: 'json', nullable: true })
    products: object[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}