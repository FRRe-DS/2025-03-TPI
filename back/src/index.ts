// domain/types.ts
export type TransportType = 'air' | 'sea' | 'rail' | 'road';

export interface Address {
  street: string;
  city: string;
  state: string;
  postal_code: string;   // en tu YAML: CP Argentino
  country: string;       // ISO-3166-1 alpha-2 (e.g., 'AR')
}

export interface ProductItemInput {
  id: number;
  quantity: number;      // unidades de este producto
  weight: number;        // kg por unidad
  length: number;        // cm
  width: number;         // cm
  height: number;        // cm
}

export interface ShippingCostRequest {
  delivery_address: Address;
  departure_postal_code: string;
  products: ProductItemInput[];
}

// Config centralizada de umbrales por modo
export const TransportThresholds = {
  air: {
    maxWeightKgPerUnit: 30,
    maxDimCmPerSide: 120,
    maxGirthPlusLengthCm: 300, // típico para paquetería aérea
    maxDistanceKm: 3000        // opcional
  },
  road: {
    maxWeightKgPerUnit: 1000,
    maxDimCmPerSide: 250,
    maxGirthPlusLengthCm: 700,
    maxDistanceKm: 2000
  },
  rail: {
    minDistanceKm: 500,        // suele valer la pena a distancia media/larga
    maxWeightKgPerUnit: 5000,
    maxDimCmPerSide: 300
  },
  sea: {
    minDistanceKm: 1000,       // internacional o muy largas
    minVolumetricWeightKg: 200 // palet/volumen significativamente grande
  }
} as const;

export function pesofacturablebulto (
  longitud: number, 
  ancho: number, 
  alto: number, 
  divisor: 5000, // numero predefinido para pasar de cm3 a kg en los aviones 
): number {
  // fórmula estándar IATA para cm: (L * W * H) / 5000
  return (longitud * ancho * alto) / divisor;
}   //Tiene en cuenta el volumen, ya que en los aviones para cobrar se tiene en cuenta el espacio que ocupan. Pero saco el peso en funcion del volumen y siempre es aproximado a su peso real 
 
