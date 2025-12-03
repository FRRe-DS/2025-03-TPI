import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { AddressDomain } from '../domain/address';
@Entity('addresses')
export class Address implements AddressDomain {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100 })
    street: string;

    @Column({ type: 'varchar', length: 100 })
    city: string;

    @Column({ type: 'varchar', length: 100 })
    state: string;

    @Column({ type: 'varchar', length: 100 })
    country: string;

    @Column({ type: 'varchar', length: 100 })
    postalCode: string;
}