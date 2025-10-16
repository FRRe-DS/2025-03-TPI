import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Shipment } from './shipment.entity';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100 })
    name: string;

    @Column({ type: 'varchar', length: 100, unique: true })
    email: string;

    // Relación uno a muchos con Shipment (un usuario puede tener muchos envíos)
    @OneToMany(() => Shipment, (shipment) => shipment.user)
    shipments: Shipment[];
}