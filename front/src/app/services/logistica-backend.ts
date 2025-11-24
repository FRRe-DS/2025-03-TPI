// src/services/logistica-mock.ts
import { API_BASE_URL } from "@/config/api";
import type {
  ShippingCostRequest,
  ShippingCostResponse,
  ShippingCreationRequest,
  ShippingDetail,
  ShippingResponse,
} from "@/types/logistica";

function traducirError(mensaje: string): string {
  if (mensaje.includes("Authentication failed")) {
    return "Algo salió mal al crear el envío. Intente nuevamente.";
  }

  return mensaje; 
}

export async function calcularCosto(data: ShippingCostRequest, token: string | null): Promise<ShippingCostResponse> {

  try {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    // Agregar token si está disponible
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/shipping/cost`, {
      method: "POST",
      headers,
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

export async function crearEnvio(data: ShippingCreationRequest, token: string | null): Promise<ShippingResponse> {
  console.log("Crear envio data", data);

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  // Agregar token si está disponible
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/shipping`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });

  // VERIFICACIÓN DE ERROR AGREGADA
  if (!response.ok) {
    // Intentamos obtener detalles del error del cuerpo de la respuesta
    const errorBody = await response.json().catch(() => null);
    const errorMessage = errorBody?.message || `Error al crear envío: ${response.status} ${response.statusText}`;
    
    console.error("Error al crear envío (backend):", errorMessage);
    throw new Error(traducirError(errorMessage));
  }

  const responseData: ShippingResponse = await response.json();

  console.log("Crear envio response", responseData);

  return responseData;
}

export async function consultarEnvio(shippingId: string, token: string | null): Promise<ShippingDetail> {
  console.log(`Consultar envío ID: ${shippingId}`);

  const headers: HeadersInit = {};

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/shipping/${shippingId}`, {
    method: "GET",
    headers,
  });

  // VERIFICACIÓN DE ERROR
  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    const errorMessage = errorBody?.message || `Error al consultar envío: ${response.status} ${response.statusText}`;
    
    console.error("Error al consultar envío (backend):", errorMessage);
    throw new Error(traducirError(errorMessage)); 
  }

  const responseData: ShippingDetail = await response.json();

  console.log("Consultar envio response", responseData);

  return responseData;
}

export async function actualizarEstadoEnvio(
  shippingId: string,
  newStatus: string,
  notes: string | null,
  token: string | null
) {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const body = {
    newStatus,
    ...(notes ? { notes } : {})
  };

  const response = await fetch(`${API_BASE_URL}/shipping/${shippingId}/status`, {
    method: "PATCH",
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    const errorMessage =
      errorBody?.message ||
      `Error al actualizar estado: ${response.status} ${response.statusText}`;

    throw new Error(errorMessage);
  }

  const data = await response.json();
  return data;
}
