import { Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Shipment } from './shipment.entity';
import { UserDomain } from '../domain/user';

@Entity('users')
export class User implements UserDomain {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(() => Shipment, (shipment) => shipment.user)
    shipments: Shipment[];
}