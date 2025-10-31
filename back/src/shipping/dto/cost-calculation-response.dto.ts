import { IsArray, IsNotEmpty, IsNumber, IsPositive, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { TransportDto } from './transport.dto';

// DTO para cada producto en la respuesta (con su costo individual)
export class ProductCostDto {
  @IsNumber()
  @IsPositive()
  id: number;

  @IsNumber()
  @IsPositive()
  cost: number;
}

// DTO de respuesta para el cálculo de costos
export class CostCalculationResponseDto {
  @IsNotEmpty()
  @IsString()
  currency: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  total_cost: number;

  @IsNotEmpty()
  @IsString()
  transport_type: string;

  @IsArray()
  @IsNotEmpty()
  products: ProductCostDto[];

  //Ver si se agrega ESTIMATED DAYS y DELIVERY ADDRESS

  //Lo ideal seria importar la clase ProductCostDto para evitar traer todo el paquete de cost-calculation-service.ts
}