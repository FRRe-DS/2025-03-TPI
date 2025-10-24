import { Address } from '../entities/address.entity';

export default abstract class AddressRepository {
    abstract createAddress(address: Partial<Address>): Promise<Address>;
    abstract getAllAddresses(): Promise<Address[]>;
    abstract count(): Promise<number>;
}
