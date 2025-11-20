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

export async function getEnvioByID(id: string): Promise<ShippingResponse> {
  
  console.log("Get id", id);

  try {
    const url = `${API_BASE_URL}/shipping/${id}`;
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error del servidor al obtener envío ${id} (${response.status})`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error(`Error al obtener el envío ${id}:`, error);
    throw error;
  }
}

export async function getEnvio(): Promise<ShippingResponse[]> {

  try {
    const url = `${API_BASE_URL}/shipping`;
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": "Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICI4cWtZekw0ZmkxQ3JMNG9sWlMzb3hXb1lsbW90VVJrSloydUVMVnVHb0owIn0.eyJleHAiOjE3NjM2NTYzMTYsImlhdCI6MTc2MzY1NjAxNiwianRpIjoiNDA5MGY0ZDAtZmJjNi00ZDhiLTgzMjYtZjVkNjFjYTJjNDNlIiwiaXNzIjoiaHR0cDovL2tleWNsb2FrOjgwODAvcmVhbG1zL2RzLTIwMjUtcmVhbG0iLCJzdWIiOiI0ZTRiZDVlYy04MGYzLTQ2ODctOWE0MS1iNDUzOWY3NTY5YTQiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJncnVwby0wMyIsInNjb3BlIjoidXN1YXJpb3M6cmVhZCBlbnZpb3M6cmVhZCByZXNlcnZhczpyZWFkIHN0b2NrOndyaXRlIHN0b2NrOnJlYWQgZW52aW9zOndyaXRlIHJlc2VydmFzOndyaXRlIHByb2R1Y3RvczpyZWFkIiwiY2xpZW50SG9zdCI6IjE5Mi4xNjguNjUuMSIsInJvbGVzIjpbImxvZ2lzdGljYS1iZSIsImxvZ2lzdGljYS1iZSIsImxvZ2lzdGljYS1iZSIsImxvZ2lzdGljYS1iZSIsImxvZ2lzdGljYS1iZSIsImxvZ2lzdGljYS1iZSIsImxvZ2lzdGljYS1iZSIsImxvZ2lzdGljYS1iZSJdLCJjbGllbnRBZGRyZXNzIjoiMTkyLjE2OC42NS4xIiwiY2xpZW50X2lkIjoiZ3J1cG8tMDMifQ.Ba-C0QuaISDfY78Eo6GCRild9u778UjrkerCrq45qzHE6MrDqn_pmackhBsKiIOBKALe1_Lqn0gXHBXs4ccwvnia5OmQFQdEWe_puFzv16ENGhsGRieymaJzX4R2vLt4_4m550BfptSXrKNotnDqp100rwQ6HjZUjIr5ZnMi9jrZay5smDA3pJcIt5LlkqfMm5G0sGdLFPvskGgLhJGB3yz1_FpcEIY2I8iv2aHX87OjYrBKfBkvX6hbVlHsheVhmwGA_KX89LJvwjYw9-ryr17ZUZuLQNeXOp0pH_vXHpytB9YDK66QbNK1W9DlpuJiotaE7aHyeOls4KWBw4bHoQ",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error del servidor al obtener envío (${response.status})`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error(`Error al obtener el envío:`, error);
    throw error;
  }
}