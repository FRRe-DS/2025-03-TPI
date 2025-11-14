import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { TransportMethods } from '../../shared/enums/transport-methods.enum';
import { Shipment } from './shipment.entity';

@Entity('transport_methods')
export class TransportMethod {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100, nullable: false })
    name: string;

    @Column({ type: 'enum', enum: TransportMethods })
    type: TransportMethods;

    @Column({ type: 'varchar', length: 100, nullable: false })
    estimatedDays: string;

    // Relación uno a muchos con Shipment
    @OneToMany(() => Shipment, (shipment) => shipment.transportMethod)
    shipments: Shipment[];
}