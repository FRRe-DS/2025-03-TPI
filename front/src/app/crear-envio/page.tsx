"use client";

import { useEffect, useState } from "react";
import { crearEnvio } from "../services/logistica-backend";
import type {
  Address,
  ProductItemInput,
  ShippingCreationRequest,
  ShippingResponse,
  TransportMethod, 
} from "@/types/logistica";
import { getTransportMethodName } from "@/types/transport-methods";

function emptyProduct(id = 1): ProductItemInput {
  return { id, quantity: 1 };
}

export default function CrearEnvioPage() {
  const [userId, setUserId] = useState<number | string>(456); 
  const [address, setAddress] = useState<Address>({
    street: "", 
    city: "", 
    state: "", 
    postal_code: "", 
    country: "AR",
  });
  const [products, setProducts] = useState<ProductItemInput[]>([emptyProduct(1)]);
  const [loading, setLoading] = useState(false);
  
  const [result, setResult] = useState<ShippingResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [transportMethod, setTransportMethod] = useState<string>("");
  const [transportMethods, setTransportMethods] = useState<TransportMethod[]>([]);

  const [formInvalidMessage, setFormInvalidMessage] = useState<string | null>(null);


  useEffect(() => {
    //llamada a la api de transportes       
    const fetchTransportes = async () => {
      try {
        const response = await fetch("http://localhost:3010/shipping/transport-methods");
        const data: { transportMethods: TransportMethod[] } = await response.json();
        console.log("Tengo mis transportes!!", data);
        setTransportMethods(data.transportMethods);
      } catch (error) {
        console.error("Error al cargar métodos de transporte:", error);
      }
    }

    fetchTransportes();
}, []);
  
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

  const getValidationError = (): string | null => {
    const hasLettersRegex = /[a-zA-Z]/;
    const isNumericOnlyRegex = /^\d+$/;

    // 1. Validar ID de Usuario
    if (!userId || Number(userId) < 1) return "Debe ingresar un ID de usuario válido.";

    // 2. Validar Dirección
    const streetTrim = address.street.trim();
    if (!address.street.trim()) return "El campo 'Calle' es obligatorio.";
    if (!hasLettersRegex.test(streetTrim)) return "El valor ingresado en el campo 'Calle' debe ser válido.";

    const cityTrim = address.city.trim();
    if (!address.city.trim()) return "El campo 'Ciudad' es obligatorio.";
    if (!hasLettersRegex.test(cityTrim)) return "El valor ingresado en el campo 'Ciudad' debe ser válido.";

    const stateTrim = address.state.trim();
    if (!address.state.trim()) return "El campo 'Provincia' es obligatorio.";
    if (!hasLettersRegex.test(stateTrim)) return "El valor ingresado en el campo 'Provincia' debe ser válido.";

    const countryTrim = address.country.trim();
    if (!address.country.trim()) return "El campo 'País' es obligatorio.";
    if (!hasLettersRegex.test(countryTrim)) return "El valor ingresado en el campo 'País' debe ser válido.";

    const postalCodeTrim = address.postal_code.trim();
    if (!address.postal_code.trim()) return "El campo 'Código Postal' es obligatorio.";
    if (!isNumericOnlyRegex.test(postalCodeTrim)) return "El valor ingresado en el campo 'Código Postal' debe ser válido.";

    // 3. Validar Método de Transporte
    if (!transportMethod.trim()) return "El campo 'Método de transporte' es obligatorio.";

    // 4. Validar Productos
    if (products.length === 0) return "Agregue al menos un producto.";
    for (const p of products) {
      if (!p.id || p.id < 1) return "Debe ingresar un ID de producto válido.";
    //  if (!p.quantity || p.quantity < 1) return "La Cantidad del Producto debe ser un número >= 1.";
    }
    
    return null;
  };
  
  useEffect(() => {
    setFormInvalidMessage(getValidationError()); 
  }, [userId, address, products, transportMethod]);

  const onSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);
    setResult(null);

    const validationCheck = getValidationError();
    if (validationCheck) {
      setError(validationCheck); 
      return;
    }
    
    const data: ShippingCreationRequest = {
      order_id: Number("123" + Date.now().toString()),
      user_id: Number(userId), 
      delivery_address: address,
      products,
      transport_type: transportMethod,
    };

    console.log("On submit data", data);

    try {
      setLoading(true);
      const resp = await crearEnvio(data); 
      setResult(resp);
    } catch (err) {
      console.error(err);
      setError("Error creating shipment. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = "mt-1 p-2 border border-[var(--color-gray)] rounded-md focus:ring-0 focus:border-[var(--color-primary)] transition-colors duration-200 w-full bg-white";
  const labelStyle = "text-sm text-[var(--color-text-dark)] font-medium";
  
  const baseOutlineButton = "cursor-pointer border-2 border-[var(--color-primary)] text-[var(--color-primary)] bg-white rounded-full font-semibold hover:bg-[var(--color-primary)] hover:text-[var(--color-light)] transition-colors duration-300 disabled:opacity-60";
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded-lg">
        <h1 className="text-2xl font-semibold text-brand mb-2">Crear Nuevo Envío</h1>
        <p className="text-sm text-gray-600 mb-6">
          Complete los detalles y el ID de usuario para crear el envío.
        </p>

        <form onSubmit={onSubmit} className="space-y-6">
        
          <label className="flex flex-col">
            <span className="text-sm text-gray-700 font-bold">ID de Usuario (user_id)</span>
            <input
              type="number"
              min={1}
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="mt-1 p-2 border rounded"
              placeholder="Ej: 456"
            />
          </label>
          
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


            <label className="flex flex-col">
              <span className={labelStyle}>Método de transporte</span>
              <select
                value={transportMethod}
                onChange={(e) => setTransportMethod(e.target.value)}
                className={inputStyle}
              >
                <option value="">Seleccione un método de transporte</option>
                {/* con map recorremos el array y devolvemos algo por cada elemento */}
                {transportMethods.map((method) => (
                  <option key={method.id} value={method.type}>
                    {
                      getTransportMethodName(method.type)
                     }
                  </option>
                ))}
              </select>
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
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-60"
            >
              {loading ? "Creando..." : "Crear Envío"}
            </button>
            
            {/* ... Botón Limpiar resultado ... */}
          </div>
        </form>

        {/* Resultado (Adaptado a la respuesta de creación) */}
        {result && (
          <div className="mt-6 p-4 border rounded bg-green-50">
            <h3 className="text-lg font-medium text-green-700 mb-2">Envío Creado con Éxito</h3>
            <p>
              <strong>ID del Envío:</strong> {result.id}
            </p>
            <p>
              <strong>Estado:</strong> {result.status.toUpperCase()}
            </p>
            <p>
              <strong>Tipo de Transporte:</strong> {result.transportMethod.name}
            </p>
            <p>
              <strong>Costo Total:</strong> ${result.totalCost}
            </p>
            <p>
              <strong>Fecha de Creación:</strong> {new Date(result.createdAt).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}