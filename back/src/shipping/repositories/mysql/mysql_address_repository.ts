import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from '../../entities/address.entity';
import AddressRepository from '../address.repository';
import { AddressDto } from 'src/shipping/dto/address.dto';

@Injectable()
export default class MySqlAddressRepository implements AddressRepository {
    constructor(
        @InjectRepository(Address)
        private readonly addressRepository: Repository<Address>,
    ) { }

    async saveAddress(address: Partial<Address>): Promise<Address> {
        return this.addressRepository.save(address);
    }

    async createAddress(address: AddressDto): Promise<Address> { // <--- 1. async y Promise
        
        // 2. Primero creamos la instancia en memoria (como tenías)
        const newAddress = this.addressRepository.create({
            street: address.street,
            city: address.city,
            state: address.state,
            postalCode: address.postal_code,
            country: address.country,
        });

        // 3. ¡ESTO FALTABA! Guardamos en la DB y esperamos
        return await this.addressRepository.save(newAddress);
    }

    async count(): Promise<number> {
        return this.addressRepository.count();
    }

    async findAll(): Promise<Address[]> {
        return await this.addressRepository.find();
    }
}
