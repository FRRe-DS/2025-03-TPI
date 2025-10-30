import { Address } from '../entities/address.entity';

export default abstract class AddressRepository {
    abstract saveAddress(address: Partial<Address>): Promise<Address>;
    abstract createAddress(address: Partial<Address>): Address;
}
