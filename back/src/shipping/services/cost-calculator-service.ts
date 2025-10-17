import { Injectable } from '@nestjs/common';

// Define el "aforador" estándar de la industria
const VOLUMETRIC_FACTOR = 5000; // cm3 por kg (Estándar IATA)

// 1. Mapeo de letra de CPA a Región (completo para Argentina)
const PROVINCE_TO_REGION_MAP = {
  C: 'AMBA', // CABA
  B: 'AMBA', // Buenos Aires
  H: 'NEA', // Chaco
  W: 'NEA', // Corrientes
  P: 'NEA', // Formosa
  N: 'NEA', // Misiones
  E: 'NEA', // Entre Ríos (Técnicamente Litoral, lo agrupamos)
  S: 'CENTRO', // Santa Fe
  X: 'CENTRO', // Córdoba
  D: 'CENTRO', // San Luis
  M: 'CUYO', // Mendoza
  J: 'CUYO', // San Juan
  F: 'NOA', // La Rioja
  K: 'NOA', // Catamarca
  T: 'NOA', // Tucumán
  G: 'NOA', // Santiago del Estero
  A: 'NOA', // Salta
  Y: 'NOA', // Jujuy
  L: 'PAMPA', // La Pampa
  Q: 'PATAGONIA', // Neuquén
  R: 'PATAGONIA', // Río Negro
  U: 'PATAGONIA', // Chubut
  Z: 'PATAGONIA', // Santa Cruz
  V: 'PATAGONIA', // Tierra del Fuego
};

// Define una tarifa base por zona (simulada)
const ZONE_RATES = {
  LOCAL: 1500, // ARS
  REGIONAL: 3000, // ARS
  NACIONAL: 5000, // ARS
};
type ShippingZone = keyof typeof ZONE_RATES;

// Define un costo por kg
const COST_PER_KG = 200; // ARS revisar por las dudas 

@Injectable()
export class CostCalculatorService {

  /**
   * Calcula el peso volumétrico de UNA unidad.
   */
  public getVolumetricWeight(length: number, width: number, height: number): number {
    const volumeInCm3 = length * width * height;
    return volumeInCm3 / VOLUMETRIC_FACTOR;
  }

  /**
   * Simula la determinación de una zona basada en Códigos Postales.
   */
  public getShippingZone(originCP: string, destinationCP: string): ShippingZone {
    const originProvince = originCP.charAt(0).toUpperCase();
    const destinationProvince = destinationCP.charAt(0).toUpperCase(); //Asegurarme que obtiene la letra de la provincia real que contiene ese codigo postal 

    if (originProvince === destinationProvince) {
        return 'LOCAL';
    }

    const originRegion = PROVINCE_TO_REGION_MAP[originProvince];
    const destinationRegion = PROVINCE_TO_REGION_MAP[destinationProvince];

    if (originRegion === destinationRegion) {
        return 'REGIONAL';
    }
    
    return 'NACIONAL';
    
   }

  /**
   * Calcula el costo total basado en pesos y zona.
   */
  public calculateTotalCost(billableWeight: number, zone: ShippingZone): number {  //habria que ver una funcionalidad para calcular el billableWeight 
    const baseRate = ZONE_RATES[zone];
    const variableCost = billableWeight * COST_PER_KG;
    const totalCost = baseRate + variableCost;
    return parseFloat(totalCost.toFixed(2));
  }
}