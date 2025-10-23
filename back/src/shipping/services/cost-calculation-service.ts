import { Injectable } from '@nestjs/common';
import { CostCalculationResponseDto } from '../dto/cost-calculation-response.dto';

// --- Lógica de Zonificación basada en CPA (Código Postal Argentino) ---

// Mapeo de primera letra del CPA a Región
const PROVINCE_TO_REGION_MAP = {
  C: 'AMBA',
  B: 'AMBA',
  H: 'NEA',
  W: 'NEA',
  P: 'NEA',
  N: 'NEA',
  E: 'NEA',
  S: 'CENTRO',
  X: 'CENTRO',
  D: 'CENTRO',
  M: 'CUYO',
  J: 'CUYO',
  F: 'NOA',
  K: 'NOA',
  T: 'NOA',
  G: 'NOA',
  A: 'NOA',
  Y: 'NOA',
  L: 'PAMPA',
  Q: 'PATAGONIA',
  R: 'PATAGONIA',
  U: 'PATAGONIA',
  Z: 'PATAGONIA',
  V: 'PATAGONIA',
};

type Region =
  (typeof PROVINCE_TO_REGION_MAP)[keyof typeof PROVINCE_TO_REGION_MAP];

// Tarifas Base por Nivel de Zona
const ZONE_LEVEL_RATES = {
  LOCAL: 1500, // Envío dentro de la misma provincia
  REGIONAL: 3500, // Envío dentro de la misma región
  NACIONAL: 6000, // Envío entre regiones distintas
};

type ZoneLevel = keyof typeof ZONE_LEVEL_RATES;


// Constantes de cálculo
const VOLUMETRIC_FACTOR = 5000; // Factor IATA (cm³ por kg)
const COST_PER_BILLABLE_KG = 250; // ARS por cada kg facturable

//Agregar ESTIMATED DELIVERY TIME con un objeto similar a INTER_REGION_COSTS (revisar despues como implementarlo)
const ESTIMATED_DELIVERY_TIME = {
  'AMBA-NEA': [5, 7],
  'AMBA-CENTRO': [3, 5],
  'AMBA-CUYO': [6, 8],
  'AMBA-NOA': [7, 10],
  'AMBA-PAMPA': [4, 6],
  'AMBA-PATAGONIA': [8, 12],
  'NEA-CENTRO': [6, 8],
  'NEA-CUYO': [7, 9],
  'NEA-NOA': [5, 7],
  'NEA-PAMPA': [6, 8],
  'NEA-PATAGONIA': [9, 12],
  'CENTRO-CUYO': [5, 7],
  'CENTRO-NOA': [6, 8],
  'CENTRO-PAMPA': [4, 6],
  'CENTRO-PATAGONIA': [7, 10],
  'CUYO-NOA': [5, 7],
  'CUYO-PAMPA': [6, 8],
  'CUYO-PATAGONIA': [7, 10],
  'NOA-PAMPA': [6, 8],
  'NOA-PATAGONIA': [8, 12],
  'PAMPA-PATAGONIA': [7, 10],
};

// Interfaz para producto con detalles completos (obtenidos del enlace de la API de stock)
export interface ProductWithDetails {
  id: number;
  quantity: number;
  weight: number; // peso en kg por unidad
  length: number; // largo en cm
  width: number; // ancho en cm
  height: number; // alto en cm
  warehouse_postal_code: string; // CPA del almacén donde está el producto. Revisar porque cada producto tiene una ubicación asociada, entonces capaz habria que mapear los almacenes por cada producto o algo similar 
}

@Injectable()
export class CostCalculatorService {
  // Centro de distribución en CABA (donde se consolidan todos los envíos)
  private readonly DISTRIBUTION_CENTER = 'C1000AAA';

  /**
   * Calcula el costo total considerando dos tramos:
   * 1) Producto en almacén → Centro de distribución (CABA)
   * 2) Centro de distribución → Destino final del cliente
   */
  calculateCost(
    products: ProductWithDetails[],
    destinationPostalCode: string,
  ): CostCalculationResponseDto {
    
    // ===== PASO 1: Calcular costo de productos → Centro de distribución =====
    const productToDistributionCost = this.calculateProductToDistributionCost(products);
    
    // ===== PASO 2: Calcular peso facturable total =====
    let totalRealWeight = 0;
    let totalVolumetricWeight = 0;

    const productCosts = products.map((p) => {
      const realWeightItem = p.weight * p.quantity;
      const volumetricWeightUnit = this.getVolumetricWeight(
        p.length,
        p.width,
        p.height,
      );
      const volumetricWeightItem = volumetricWeightUnit * p.quantity;
      const billableWeightItem = Math.max(realWeightItem, volumetricWeightItem);

      totalRealWeight += realWeightItem;
      totalVolumetricWeight += volumetricWeightItem;

      return {
        id: p.id,
        billableWeight: billableWeightItem,
        calculatedCost: billableWeightItem * COST_PER_BILLABLE_KG,
      };
    });

    const totalBillableWeight = Math.max(totalRealWeight, totalVolumetricWeight);

    // ===== PASO 3: Calcular costo Centro distribución → Destino final =====
    const zoneLevel = this.getZoneLevel(this.DISTRIBUTION_CENTER, destinationPostalCode);
    const baseRate = ZONE_LEVEL_RATES[zoneLevel];
    const totalVariableCost = totalBillableWeight * COST_PER_BILLABLE_KG;

    // ===== PASO 4: COSTO TOTAL = Producto→Distribución + Distribución→Destino =====
    const distributionToDestinationCost = baseRate + totalVariableCost;
    const totalCost = productToDistributionCost + distributionToDestinationCost;

    // ===== PASO 5: Prorratear costos entre productos =====
    const finalProductCosts = productCosts.map((p) => {
      const weightRatio =
        totalBillableWeight > 0 ? p.billableWeight / totalBillableWeight : 0;
      
      // Costo fijo prorrateado
      const fixedCostShare = baseRate * weightRatio;
      
      // Costo variable del producto
      const variableCostShare = p.calculatedCost;
      
      // Costo de consolidación prorrateado
      const consolidationCostShare = productToDistributionCost * weightRatio;
      
      const finalItemCost = fixedCostShare + variableCostShare + consolidationCostShare;

      return {
        id: p.id,
        cost: parseFloat(finalItemCost.toFixed(2)),
      };
    });

    // ===== PASO 6: Retornar respuesta =====
    return {
      currency: 'ARS',
      total_cost: parseFloat(totalCost.toFixed(2)),
      products: finalProductCosts,
    };
  }

  /**
   * Calcula el costo de traer productos desde sus almacenes al centro de distribución.
   * Considera que cada producto puede estar en un almacén diferente.
   */
  private calculateProductToDistributionCost(
    products: ProductWithDetails[],
  ): number {
    let totalConsolidationCost = 0;

    for (const product of products) {
      // Obtener zona del almacén donde está el producto
      const zoneLevel = this.getZoneLevel(
        product.warehouse_postal_code,
        this.DISTRIBUTION_CENTER,
      );

      // Calcular peso facturable del producto
      const realWeight = product.weight * product.quantity;
      const volumetricWeight = 
        this.getVolumetricWeight(product.length, product.width, product.height) * 
        product.quantity;
      const billableWeight = Math.max(realWeight, volumetricWeight);

      // Costo base según zona
      const baseRate = ZONE_LEVEL_RATES[zoneLevel];
      
      // Costo por peso (70% del costo normal - consolidación interna)
      const weightCost = billableWeight * COST_PER_BILLABLE_KG * 0.7;

      // Sumar al costo total de consolidación (base reducida al 50%)
      totalConsolidationCost += baseRate * 0.5 + weightCost;
    }

    return parseFloat(totalConsolidationCost.toFixed(2));
  }

  // --- Métodos Auxiliares Privados ---

  private getVolumetricWeight(
    length: number,
    width: number,
    height: number,
  ): number {
    const volumeInCm3 = length * width * height;
    return volumeInCm3 / VOLUMETRIC_FACTOR;
  }

  /**
   * Obtiene la Región Geográfica a partir de la primera letra del CPA.
   * @param postalCode - Código Postal Argentino
   * @returns Región geográfica
   */
  private getRegionFromCP(postalCode: string): Region | undefined {
    const provinceInitial = postalCode?.charAt(0).toUpperCase();
    return PROVINCE_TO_REGION_MAP[provinceInitial];
  }

  /**
   * Determina el Nivel de Zona (LOCAL, REGIONAL, NACIONAL).
   * @param originCP - Código postal de origen
   * @param destinationCP - Código postal de destino
   * @returns Nivel de zona
   */
  private getZoneLevel(originCP: string, destinationCP: string): ZoneLevel {
    const originProvince = originCP?.charAt(0).toUpperCase();
    const destProvince = destinationCP?.charAt(0).toUpperCase();

    // Misma provincia = LOCAL
    if (originProvince === destProvince) return 'LOCAL';

    // Verificar si están en la misma región
    const originRegion = this.getRegionFromCP(originCP);
    const destRegion = this.getRegionFromCP(destinationCP);

    if (originRegion && destRegion && originRegion === destRegion) {
      return 'REGIONAL';
    }

    return 'NACIONAL';
  }
}