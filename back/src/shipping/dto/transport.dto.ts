import { IsNotEmpty, IsIn } from "class-validator"

export class TransportDto {
    @IsNotEmpty()
    @IsIn(['air', 'sea', 'road', 'rail'])
    type: 'air' | 'sea' | 'road' | 'rail';
}