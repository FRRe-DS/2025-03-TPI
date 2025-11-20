import { IsNotEmpty, IsIn } from "class-validator"

export class TransportDto {
    @IsNotEmpty(    { message: 'The field "type" cannot be empty' })
    @IsIn(['air', 'sea', 'road', 'rail'], { message: 'The field "type" must be one of the following values: air, sea, road, rail' })
    type: 'air' | 'sea' | 'road' | 'rail';
}