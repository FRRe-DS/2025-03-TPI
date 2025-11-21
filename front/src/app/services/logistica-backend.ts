// src/services/logistica-mock.ts
import { API_BASE_URL } from "@/config/api";
import type {
  ShippingCostRequest,
  ShippingCostResponse,
  ShippingCreationRequest,
  ShippingResponse,
} from "@/types/logistica";

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
      // Intentamos leer el mensaje de error del backend si existe
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error del servidor (${response.status})`);
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
      // NOTA: Si tu backend requiere auth, aquí deberías agregar el header Authorization
      // "Authorization": `Bearer ${token}` 
    },
    body: JSON.stringify(data),
  });

  // VERIFICACIÓN DE ERROR AGREGADA
  if (!response.ok) {
    // Intentamos obtener detalles del error del cuerpo de la respuesta
    const errorBody = await response.json().catch(() => null);
    const errorMessage = errorBody?.message || `Error al crear envío: ${response.status} ${response.statusText}`;
    
    console.error("Error al crear envío (backend):", errorMessage);
    throw new Error(errorMessage);
  }

  const responseData: ShippingResponse = await response.json();

  console.log("Crear envio response", responseData);

  return responseData;
}