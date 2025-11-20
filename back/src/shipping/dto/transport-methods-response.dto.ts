import { IsArray, IsEnum, IsNotEmpty, IsString, ValidateNested, ArrayNotEmpty } from "class-validator";
import { TransportMethods } from "../../shared/enums/transport-methods.enum";
import { Type } from "class-transformer/types/decorators/type.decorator";

export class TransportMethodsItem {
    
    @IsEnum(TransportMethods, { message: 'The field "type" must be a valid value from the following: ' + Object.values(TransportMethods).join(', ') })
    @IsNotEmpty({ message: 'The field "type" cannot be empty' })
    type: TransportMethods
    
    @IsString({ message: 'The field "name" must be a string' })
    @IsNotEmpty({ message: 'The field "name" cannot be empty' })
    name: string;
    
    @IsString({ message: 'The field "estimatedDays" must be a string' })
    @IsNotEmpty({ message: 'The field "estimatedDays" cannot be empty' })
    estimatedDays: string;
}

export class TransportMethodsResponseDto {

    @IsArray( { message: 'The field "transportMethods" must be an array' })
    @ArrayNotEmpty({ message: 'The field "transportMethods" cannot be empty' })
    @ValidateNested({ each: true })
    @Type(() => TransportMethodsItem)
    transportMethods: TransportMethodsItem[];
}
