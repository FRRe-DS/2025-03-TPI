import api from "./api";

// Calcular costo
export async function calcularCosto(data: unknown) {
  const res = await api.post("/shipping/cost", data);
  return res.data;
}

// Crear envío
export async function crearEnvio(data: unknown) {
  const res = await api.post("/shipping", data);
  return res.data;
}

// Consultar envío por ID
export async function getEnvio(id: string) {
  const res = await api.get(`/shipping/${id}`);
  return res.data;
}

export async function getShipments() {
  const res = await api.get("/shipping");
  return res.data;
}