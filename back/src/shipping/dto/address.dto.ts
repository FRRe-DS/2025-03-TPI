import { IsString, IsNotEmpty } from 'class-validator';

export class AddressDto {
   @IsString() @IsNotEmpty()
    street: string;

    @IsString()@IsNotEmpty()
    city: string;

    @IsString() @IsNotEmpty()
    state: string;

    @IsString() @IsNotEmpty()
    country: string;

    @IsString() @IsNotEmpty()
    postalCode: string;
}