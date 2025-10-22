// src/services/logistica-mock.ts
import type {
  ShippingCostRequest,
  ShippingCostResponse,
  ShippingCreationRequest,
  ShippingCreationResponse,
  ShippingResponse,
  ProductCost,
} from "@/types/logistica";

/**
 * Mock simple que simula cálculo de costo.
 * - calcula coste por producto = base + peso * factor + volumen * factorVol
 * - devuelve un transporte elegido según distancia simple (postal code)
 */
export async function calcularCosto(data: ShippingCostRequest): Promise<ShippingCostResponse> {

  return {
    currency: "ARS",
    total_cost: 100,
    transport_type: "air",
    products: [{ id: 1, cost: 100 }],
  };
}



export async function crearEnvio(data: ShippingCreationRequest): Promise<ShippingResponse> {

  console.log("Crear envio data", data);

  const response = await fetch("http://localhost:3010/shipping", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const responseData: ShippingResponse = await response.json();

  console.log("Crear envio response", responseData);

  return responseData;
}