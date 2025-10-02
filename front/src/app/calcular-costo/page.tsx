"use client";

import { useState } from "react";
import { calcularCosto } from "../services/logistica-mock";
import type {
  Address,
  ProductItemInput,
  ShippingCostRequest,
  ShippingCostResponse,
} from "@/types/logistica";

function emptyProduct(id = 1): ProductItemInput {
  return { id, quantity: 1, weight: 1, length: 10, width: 10, height: 5 };
}

export default function CalcularCostoPage() {
  const [address, setAddress] = useState<Address>({
    street: "",
    city: "",
    state: "",
    postal_code: "",
    country: "AR",
  });

  const [products, setProducts] = useState<ProductItemInput[]>([emptyProduct(1)]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ShippingCostResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const updateProduct = (index: number, patch: Partial<ProductItemInput>) => {
    setProducts((prev) =>
      prev.map((p, i) => (i === index ? { ...p, ...patch } : p))
    );
  };

  const addProduct = () => {
    const nextId = products.length ? Math.max(...products.map((p) => p.id)) + 1 : 1;
    setProducts((p) => [...p, emptyProduct(nextId)]);
  };

  const removeProduct = (index: number) => {
    setProducts((p) => p.filter((_, i) => i !== index));
  };

  const validate = () => {
    if (!address.street.trim()) return "Street is required";
    if (!address.city.trim()) return "City is required";
    if (!address.postal_code.trim()) return "Postal code is required";
    if (products.length === 0) return "Add at least one product";
    for (const p of products) {
      if (p.id < 1) return "Product ID must be >= 1";
      if (p.quantity < 1) return "Product quantity must be >= 1";
    }
    return null;
  };

  const onSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);
    setResult(null);

    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    const data: ShippingCostRequest = {
        delivery_address: address,
        departure_postal_code: "1000", // <-- esto faltaba
        products,
    };

    try {
      setLoading(true);
      const resp = await calcularCosto(data);
      setResult(resp);
    } catch (err) {
      console.error(err);
      setError("Error calculating cost. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded-lg">
        <h1 className="text-2xl font-semibold text-brand mb-2">Calcular Costo de Envío</h1>
        <p className="text-sm text-gray-600 mb-6">
          Complete la dirección y los productos para simular el costo.
        </p>

        <form onSubmit={onSubmit} className="space-y-6">
          {/* Address */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex flex-col">
              <span className="text-sm text-gray-700">Calle</span>
              <input
                value={address.street}
                onChange={(e) => setAddress({ ...address, street: e.target.value })}
                className="mt-1 p-2 border rounded"
                placeholder="Av. Siempre Viva 123"
              />
            </label>

            <label className="flex flex-col">
              <span className="text-sm text-gray-700">Ciudad</span>
              <input
                value={address.city}
                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                className="mt-1 p-2 border rounded"
                placeholder="Resistencia"
              />
            </label>

            <label className="flex flex-col">
              <span className="text-sm text-gray-700">Provincia</span>
              <input
                value={address.state}
                onChange={(e) => setAddress({ ...address, state: e.target.value })}
                className="mt-1 p-2 border rounded"
                placeholder="Chaco"
              />
            </label>

            <label className="flex flex-col">
              <span className="text-sm text-gray-700">Código Postal</span>
              <input
                value={address.postal_code}
                onChange={(e) => setAddress({ ...address, postal_code: e.target.value })}
                className="mt-1 p-2 border rounded"
                placeholder="3500"
              />
            </label>

            <label className="flex flex-col">
              <span className="text-sm text-gray-700">País</span>
              <input
                value={address.country}
                onChange={(e) => setAddress({ ...address, country: e.target.value })}
                className="mt-1 p-2 border rounded"
                placeholder="AR"
              />
            </label>
          </div>

          {/* Products */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-medium">Productos</h2>
              <button
                type="button"
                onClick={addProduct}
                className="text-sm text-white bg-green-600 px-3 py-1 rounded hover:bg-green-700"
              >
                + Agregar producto
              </button>
            </div>

            <div className="space-y-3">
              {products.map((p, i) => (
                <div
                  key={i}
                  className="p-3 border rounded grid grid-cols-1 md:grid-cols-3 gap-2 items-end"
                >
                  <div>
                    <label className="text-xs text-gray-600">ID del Producto</label>
                    <input
                      type="number"
                      min={1}
                      value={p.id}
                      onChange={(e) =>
                        updateProduct(i, { id: Math.max(1, Number(e.target.value)) })
                      }
                      className="mt-1 p-1 border rounded w-full"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-600">Cantidad</label>
                    <input
                      type="number"
                      min={1}
                      value={p.quantity}
                      onChange={(e) =>
                        updateProduct(i, { quantity: Math.max(1, Number(e.target.value)) })
                      }
                      className="mt-1 p-1 border rounded w-full"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => removeProduct(i)}
                      className="text-sm text-white bg-red-600 px-3 py-1 rounded hover:bg-red-700"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}

          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? "Calculando..." : "Calcular Costo"}
            </button>

            <button
              type="button"
              onClick={() => {
                setResult(null);
                setError(null);
              }}
              className="px-4 py-2 border rounded"
            >
              Limpiar resultado
            </button>
          </div>
        </form>

        {result && (
          <div className="mt-6 p-4 border rounded bg-gray-50">
            <h3 className="text-lg font-medium mb-2">Resultado</h3>
            <p>
              <strong>Total:</strong> {result.total_cost} {result.currency}
            </p>
            <p>
              <strong>Transporte:</strong> {result.transport_type}
            </p>

            <div className="mt-4">
              <h4 className="font-medium">Desglose por producto</h4>
              <ul className="mt-2 space-y-1">
                {result.products.map((pr) => (
                  <li key={pr.id} className="flex justify-between">
                    <span>Producto #{pr.id}</span>
                    <span>{pr.cost} {result.currency}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
