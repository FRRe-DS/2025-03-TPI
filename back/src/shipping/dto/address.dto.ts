import { IsString, IsNotEmpty, IsNumber, Matches } from 'class-validator';

export class AddressDto {
    @IsString({message: 'The field "street" must be a string' })
    @IsNotEmpty({message: 'The field "street" cannot be empty' })
    street: string;

    @IsString({message: 'The field "city" must be a string' })
    @IsNotEmpty({message: 'The field "city" cannot be empty' })
    city: string;

    @IsString({message: 'The field "state" must be a string' })
    @IsNotEmpty({message: 'The field "state" cannot be empty' })
    state: string;

    @IsString({message: 'The field "postal_code" must be a string' })
    @IsNotEmpty({message: 'The field "postal_code" cannot be empty' })
    @Matches(/^[A-Z]{1}\d{4}[A-Z]{3}$/, {message: 'The field "postal_code" must follow the format A1234ABC' }) 
    postal_code: string;

    @IsString({message: 'The field "country" must be a string' })
    @IsNotEmpty({message: 'The field "country" cannot be empty' })
    country: string;

}