import { IsArray } from "class-validator";
import { TransportMethods } from "../../shared/enums/transport-methods.enum";

export class TransportMethodsItem {
    type: TransportMethods
    name: string;
    estimatedDeliveryTimeInDays: number[];
}

export class TransportMethodsResponseDto {
    @IsArray()
    transportMethods: TransportMethodsItem[];
}