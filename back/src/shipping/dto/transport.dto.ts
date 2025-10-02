import { IsIn } from 'class-validator';

export class TransportDto{
    @IsIn(['air', 'sea', 'road', 'rail'])
    transportType: 'air' | 'sea' | 'road' | 'rail';
}