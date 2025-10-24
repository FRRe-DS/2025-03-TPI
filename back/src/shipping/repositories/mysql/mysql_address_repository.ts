import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from '../../entities/address.entity';
import AddressRepository from '../address.repository';

@Injectable()
export default class MySqlAddressRepository implements AddressRepository {
    constructor(
        @InjectRepository(Address)
        private readonly repository: Repository<Address>,
    ) {}

    async createAddress(address: Partial<Address>): Promise<Address> {
        return this.repository.save(address);
    }

    async getAllAddresses(): Promise<Address[]> {
        return this.repository.find();
    }

    async count(): Promise<number> {
        return this.repository.count();
    }
}