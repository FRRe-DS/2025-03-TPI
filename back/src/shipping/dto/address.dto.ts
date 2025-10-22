import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class AddressDto {
    @IsString()
    @IsNotEmpty()
    street: string;

    @IsString()
    @IsNotEmpty()
    city: string;

    @IsString()
    @IsNotEmpty()
    state: string;

    @IsNumber()
    @IsNotEmpty()
    postal_code: number;

    @IsString()
    @IsNotEmpty()
    country: string;

}