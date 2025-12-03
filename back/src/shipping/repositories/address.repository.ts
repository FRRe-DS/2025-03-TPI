import { AddressDto } from '../dto/address.dto';
import { AddressDomain } from '../domain/address';

export default abstract class AddressRepository {
    abstract saveAddress(address: Partial<AddressDomain>): Promise<AddressDomain>;
    abstract createAddress(address: AddressDto): Promise<AddressDomain>;
    abstract count(): Promise<number>;
    abstract findAll(): Promise<AddressDomain[]>;
}
