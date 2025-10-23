import { IsArray, IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

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

  @IsArray()
  @IsNotEmpty()
  products: ProductCostDto[];

  //Ver si se agrega ESTIMATED DAYS y DIRECCIÓN DE ENVÍO
}