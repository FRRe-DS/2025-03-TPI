import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { TransportMethods } from 'src/shared/enums/transport-methods.enum';
import { Shipment } from './shipment.entity';
import { TransportMethodDomain } from '../domain/transport-method';

@Entity('transport_methods')
export class TransportMethod implements TransportMethodDomain {
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