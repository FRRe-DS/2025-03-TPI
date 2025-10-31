// src/services/logistica-mock.ts
import { API_BASE_URL } from "@/config/api";
import type {
  ShippingCostRequest,
  ShippingCostResponse,
  ShippingCreationRequest,
  ShippingResponse,
} from "@/types/logistica";

/**
 * Mock simple que simula cálculo de costo.
 * - calcula coste por producto = base + peso * factor + volumen * factorVol
 * - devuelve un transporte elegido según distancia simple (postal code)
 */
export async function calcularCosto(data: ShippingCostRequest): Promise<ShippingCostResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/shipping/cost`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Error del servidor (${response.status})`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error al calcular el costo:", error);
    throw error;
  }
}




export async function crearEnvio(data: ShippingCreationRequest): Promise<ShippingResponse> {

  console.log("Crear envio data", data);

  const response = await fetch(`${API_BASE_URL}/shipping`, {
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