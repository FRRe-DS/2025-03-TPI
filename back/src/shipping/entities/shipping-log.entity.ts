import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Shipment } from './shipment.entity';
import { ShippingStatus } from '../../shared/enums/shipping-status.enum';

@Entity('shipping_logs')
export class ShippingLog {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    shipmentId: number;

    @ManyToOne(() => Shipment, (shipment) => shipment.logs)
    @JoinColumn({ name: 'shipmentId' })
    shipment: Shipment;

    @Column({ type: 'datetime' })
    timestamp: Date;

    @Column({
        type: 'enum',
        enum: ShippingStatus,
    })
    status: ShippingStatus;

    @Column({ type: 'text' })
    message: string;
}