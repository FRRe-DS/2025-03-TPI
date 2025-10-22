import { IsArray, IsEnum, IsNotEmpty, IsString, ValidateNested, ArrayNotEmpty } from "class-validator";
import { TransportMethods } from "../../shared/enums/transport-methods.enum";
import { Type } from "class-transformer/types/decorators/type.decorator";

export class TransportMethodsItem {
    
    @IsEnum(TransportMethods)
    @IsNotEmpty()
    type: TransportMethods
    
    @IsString()
    @IsNotEmpty()
    name: string;
    
    @IsString()
    @IsNotEmpty()
    estimatedDays: string;
}

export class TransportMethodsResponseDto {

    @IsArray()
    @ArrayNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => TransportMethodsItem)
    transportMethods: TransportMethodsItem[];
}
