import { IsString, IsNotEmpty, IsNumber, Matches } from 'class-validator';

export class AddressDto {
    @IsString({message: 'El campo "street" debe ser una cadena de texto' })
    @IsNotEmpty({message: 'El campo "street" no puede estar vacío' })
    street: string;

    @IsString({message: 'El campo "city" debe ser una cadena de texto' })
    @IsNotEmpty({message: 'El campo "city" no puede estar vacío' })
    city: string;

    @IsString({message: 'El campo "state" debe ser una cadena de texto' })
    @IsNotEmpty({message: 'El campo "state" no puede estar vacío' })
    state: string;

    @IsString({message: 'El campo "postal_code" debe ser una cadena de texto' })
    @IsNotEmpty({message: 'El campo "postal_code" no puede estar vacío' })
    //@Matches(/^[A-Z]{1}\d{4}[A-Z]{3}$/) 
    postal_code: string;

    @IsString({message: 'El campo "country" debe ser una cadena de texto' })
    @IsNotEmpty({message: 'El campo "country" no puede estar vacío' })
    country: string;

}