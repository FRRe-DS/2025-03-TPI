import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from '../../entities/address.entity';
import AddressRepository from '../address.repository';

@Injectable()
export default class MySqlAddressRepository implements AddressRepository {
    constructor(
        @InjectRepository(Address)
        private readonly addressRepository: Repository<Address>,
    ) {}

    async createAddress(address: Partial<Address>): Promise<Address> {
        return this.addressRepository.save(address);
    }

    async getAllAddresses(): Promise<Address[]> {
        return this.addressRepository.find();
    }

    async count(): Promise<number> {
        return this.addressRepository.count();
    }
}