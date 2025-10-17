import { IsArray } from "class-validator";
import { TransportMethods } from "../../shared/enums/transport-methods.enum";

export class TransportMethodsItem {
    id: number
    type: TransportMethods
    name: string;
    estimatedDays: string;
}

export class TransportMethodsResponseDto {
    @IsArray()
    transportMethods: TransportMethodsItem[];
}