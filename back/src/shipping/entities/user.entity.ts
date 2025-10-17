import { Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Shipment } from './shipment.entity';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(() => Shipment, (shipment) => shipment.user)
    shipments: Shipment[];
}