import { AddressDto } from '../dto/address.dto';
import { Address } from '../entities/address.entity';

export default abstract class AddressRepository {
    abstract saveAddress(address: Partial<Address>): Promise<Address>;
    abstract createAddress(address: AddressDto): Address;
}
