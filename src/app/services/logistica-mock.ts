export async function calcularCosto(data: any) {
  return {
    currency: "ARS",
    total_cost: 45.5,
    transport_type: "air",
    products: [
      { id: 1, cost: 20 },
      { id: 2, cost: 25.5 },
    ],
  };
}

export async function crearEnvio(data: any) {
  return {
    shipping_id: 789,
    status: "created",
    transport_type: "air",
    estimated_delivery_at: "2025-10-01T00:00:00Z",
  };
}

export async function getEnvio(id: number) {
  return {
    shipping_id: id,
    products: [
      { product_id: 12, quantity: 2 },
      { product_id: 22, quantity: 1 },
    ],
    status: "in_distribution",
    estimated_delivery_at: "2025-10-01T00:00:00Z",
    logs: [
      { timestamp: "2025-09-15T09:29:00Z", status: "in_distribution", message: "Shipment is in distribution" },
      { timestamp: "2025-09-12T09:27:00Z", status: "arrived", message: "Package arrived at delivery office" },
    ],
  };
}