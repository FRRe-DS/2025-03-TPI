import { IsString, IsNotEmpty, IsNumber, Matches } from 'class-validator';

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

    @IsString()
    @IsNotEmpty()
    @Matches(/^[A-Z]{1}\d{4}[A-Z]{3}$/) 
    postal_code: string;

    @IsString()
    @IsNotEmpty()
    country: string;

}