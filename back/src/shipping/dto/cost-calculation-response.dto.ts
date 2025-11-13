import { IsArray, IsNotEmpty, IsNumber, IsPositive, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { TransportDto } from './transport.dto';

// DTO para cada producto en la respuesta (con su costo individual)
export class ProductCostDto {
  @IsNumber({}, { message: 'The field "id" must be a number' })
  @IsPositive({ message: 'The field "id" must be a positive number' })
  id: number;

  @IsNumber({}, { message: 'The field "cost" must be a number' })
  @IsPositive({ message: 'The field "cost" must be a positive number' })
  cost: number;
}

// DTO de respuesta para el cálculo de costos
export class CostCalculationResponseDto {
  @IsNotEmpty({ message: 'The field "currency" cannot be empty' })
  @IsString({ message: 'The field "currency" must be a string' })
  currency: string;

  @IsNotEmpty({ message: 'The field "total_cost" cannot be empty' })
  @IsNumber({}, { message: 'The field "total_cost" must be a number' })
  @IsPositive({ message: 'The field "total_cost" must be a positive number' })
  total_cost: number;

  @IsNotEmpty({ message: 'The field "transport_type" cannot be empty' })
  @IsString({ message: 'The field "transport_type" must be a string' })
  transport_type: string;

  @IsArray({ message: 'The field "products" must be an array' })
  @IsNotEmpty({ message: 'The field "products" cannot be empty' })
  products: ProductCostDto[];

  //Ver si se agrega ESTIMATED DAYS y DELIVERY ADDRESS

  //Lo ideal seria importar la clase ProductCostDto para evitar traer todo el paquete de cost-calculation-service.ts
}