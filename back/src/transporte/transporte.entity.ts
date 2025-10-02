export class Address {
    street: string;
    city: string;
    state: string;
    postal_code: string;   // CP Argentino
    country: string;
}

export class ProductItemInput {
    id: number;
    quantity: number;      // unidades de este producto
    weight: number;        // kg por unidad
    length: number;        // cm
    width: number;         // cm
    height: number;        // cm
}

export class ShippingCostRequest {
    delivery_address: Address;
    departure_postal_code: string;
    products: ProductItemInput[];
}

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
}