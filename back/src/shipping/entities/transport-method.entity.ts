import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { TransportMethods } from '../../shared/enums/transport-methods.enum';
import { Shipment } from './shipment.entity';

@Entity('transport_methods')
export class TransportMethod {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'enum', enum: TransportMethods, unique: true })
    name: TransportMethods;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    baseCost: number;

    @Column({ type: 'decimal', precision: 5, scale: 2 })
    costPerKm: number;

    // Relación uno a muchos con Shipment
    @OneToMany(() => Shipment, (shipment) => shipment.transportMethod)
    shipments: Shipment[];
}