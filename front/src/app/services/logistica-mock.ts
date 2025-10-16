// src/services/logistica-mock.ts
import type {
  ShippingCostRequest,
  ShippingCostResponse,
  ShippingCreationRequest, 
  ShippingCreationResponse,
  ProductCost,
} from "@/types/logistica";

/**
 * Mock simple que simula cálculo de costo.
 * - calcula coste por producto = base + peso * factor + volumen * factorVol
 * - devuelve un transporte elegido según distancia simple (postal code)
 */
export async function calcularCosto(data: ShippingCostRequest): Promise<ShippingCostResponse> {
  // simulamos latencia
  await new Promise((r) => setTimeout(r, 700));

  const factorPeso = 10; // ARS por kg (ejemplo)
  const factorVol = 0.002; // ARS por cm^3 (ejemplo)
  const basePorProducto = 5; // ARS base por producto

  const products: ProductCost[] = data.products.map((p) => {
    const volume = p.length * p.width * p.height; // cm^3
    const costPerUnit = basePorProducto + p.weight * factorPeso + volume * factorVol;
    const totalCost = costPerUnit * p.quantity;
    return { id: p.id, cost: Math.round(totalCost * 100) / 100 };
  });

  const total_cost = products.reduce((s, x) => s + x.cost, 0);

  // elegimos transporte simple según postal code (mock)
  const transport_type = data.delivery_address.postal_code.startsWith("35") ? "Camión" : "Avión";

  return {
    currency: "ARS",
    total_cost: Math.round(total_cost * 100) / 100,
    transport_type,
    products,
  };
}


/**
 * Mock que simula la creación exitosa de un envío.
 */
export async function crearEnvio(data: ShippingCreationRequest): Promise<ShippingCreationResponse> {
  
  await new Promise((r) => setTimeout(r, 1200));

  const shippingId = Math.floor(Math.random() * 9000) + 1000; // ID aleatorio

  const transportType = data.delivery_address.postal_code.startsWith("35") ? "Camión" : "Avión";
  
  const estimatedDeliveryDate = new Date();
  estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 7);
  
  return {
    shipping_id: shippingId,
    status: "created",
    transport_type: transportType,
    estimated_delivery_at: estimatedDeliveryDate.toISOString(),
  };
}