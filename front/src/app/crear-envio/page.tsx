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
import { API_BASE_URL } from "@/config/api";

function emptyProduct(id = 1): ProductItemInput {
  return { id, quantity: 1 };
}

const BackArrowIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
    </svg>
);

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
        const response = await fetch(`${API_BASE_URL}/shipping/transport-methods`);
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
  const submitButton = `cursor-pointer px-5 py-2 bg-[var(--color-primary)] text-[var(--color-light)] rounded-full font-semibold border-2 border-[var(--color-primary)] shadow-md hover:shadow-xl hover:scale-105 transform transition-all duration-300 disabled:opacity-60`;
  const clearButton = `px-5 py-2 ${baseOutlineButton}`;
  const smallButton = `px-3 py-1 text-xs ${baseOutlineButton}`;

  return (
    // 2. ESTRUCTURA PRINCIPAL ACTUALIZADA
    <div 
        className="min-h-screen bg-slate-100 py-12 text-[var(--color-text-dark)] flex items-center justify-center"
    >
      <div className="max-w-4xl w-full mx-auto p-8 bg-white shadow-xl rounded-xl border border-[var(--color-gray)]">
        
        {/* TÍTULO ACTUALIZADO */}
        <h1 className="text-3xl font-heading font-bold text-[var(--color-primary)]">Crear Nuevo Envío</h1>
        <p className="text-sm text-[var(--color-text-dark)] opacity-80 mb-6">
          Complete los detalles y el ID de usuario para crear el envío.
        </p>

        <form onSubmit={onSubmit} className="space-y-8">
        
          {/* ID de Usuario */}
          <label className="flex flex-col">
            <span className="text-sm text-gray-700 font-bold">ID de Usuario (user_id)</span>
            <input
              type="number"
              min={1}
              value={userId}
              onChange={(e) => { setUserId(e.target.value); setError(null); }}
              className={inputStyle}
              placeholder="Ej: 456"
            />
          </label>
          
          {/* Address */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Calle */}
            <label className="flex flex-col">
              <span className={labelStyle}>Calle</span>
              <input
                value={address.street}
                onChange={(e) => { setAddress({ ...address, street: e.target.value }); setError(null); }}
                className={inputStyle}
                placeholder="Av. Siempre Viva 123"
              />
            </label>

            {/* Ciudad */}
            <label className="flex flex-col">
              <span className={labelStyle}>Ciudad</span>
              <input
                value={address.city}
                onChange={(e) => { setAddress({ ...address, city: e.target.value }); setError(null); }}
                className={inputStyle}
                placeholder="Resistencia"
              />
            </label>

            {/* Provincia */}
            <label className="flex flex-col">
              <span className={labelStyle}>Provincia</span>
              <input
                value={address.state}
                onChange={(e) => { setAddress({ ...address, state: e.target.value }); setError(null); }}
                className={inputStyle}
                placeholder="Chaco"
              />
            </label>

            {/* Código Postal */}
            <label className="flex flex-col">
              <span className={labelStyle}>Código Postal</span>
              <input
                value={address.postal_code}
                onChange={(e) => { setAddress({ ...address, postal_code: e.target.value }); setError(null); }}
                className={inputStyle}
                placeholder="3500"
              />
            </label>
            
            {/* País */}
            <label className="flex flex-col">
              <span className={labelStyle}>País</span>
              <input
                value={address.country}
                onChange={(e) => { setAddress({ ...address, country: e.target.value }); setError(null); }}
                className={inputStyle}
                placeholder="AR"
              />
            </label>


            {/* Método de transporte (Select) */}
            <label className="flex flex-col">
              <span className={labelStyle}>Método de transporte</span>
              <select
                value={transportMethod}
                onChange={(e) => { setTransportMethod(e.target.value); setError(null); }}
                className={inputStyle}
              >
                <option value="">Seleccione un método de transporte</option>
                {transportMethods.map((method) => (
                  <option key={method.id} value={method.type}>
                    {getTransportMethodName(method.type)}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {/* Products */}
          <div className="pt-4 border-t border-[var(--color-gray)]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-heading font-medium text-[var(--color-text-dark)]">Productos</h2>
              <button
                type="button"
                onClick={addProduct}
                className={smallButton}
              >
                + Agregar producto
              </button>
            </div>

            <div className="space-y-4">
              {products.map((p, i) => (
                <div
                  key={i}
                  // Contenedor de producto con estilos de tarjeta
                  className="p-4 border border-[var(--color-gray)] rounded-lg grid grid-cols-5 md:grid-cols-5 gap-4 items-end "
                >
                  <div className="col-span-2">
                    <label className="text-xs text-[var(--color-text-dark)] opacity-75">ID Producto</label>
                    <input
                      type="number"
                      min={1}
                      value={p.id}
                      onChange={(e) =>
                        updateProduct(i, { id: Math.max(1, Number(e.target.value)) })
                      }
                      // Reemplazamos p-2 por p-1 para inputs más pequeños
                      className={inputStyle.replace('p-2', 'p-1')} 
                      placeholder="Ej: 456"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="text-xs text-[var(--color-text-dark)] opacity-75">Cantidad</label>
                    <input
                      type="number"
                      min={1}
                      value={p.quantity}
                      onChange={(e) =>
                        updateProduct(i, { quantity: Math.max(1, Number(e.target.value)) })
                      }
                      className={inputStyle.replace('p-2', 'p-1')}
                      placeholder="Ej: 5"
                    />
                  </div>

                  <div className="col-span-1 flex justify-end">
                    <button
                      type="button"
                      onClick={() => removeProduct(i)}
                      className={smallButton}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Contenedor de errores con estilo de calcular-costo */}
          {(formInvalidMessage || error) && (
            <div className="text-sm p-3 bg-red-100 border border-red-300 text-red-700 rounded-md">
              {formInvalidMessage || error}
            </div>
          )}

          <div className="flex items-center gap-4 pt-4 border-t border-[var(--color-gray)]">
            
            {/* Botón para Limpiar resultado (coherencia visual) */}
             <button
              type="button"
              onClick={() => {
                setResult(null);
                setError(null);
              }}
              className={clearButton} 
            >
              Limpiar resultado
            </button>
            
            {/* Botón de Submit (estilo principal de acción) */}
            <button
              type="submit"
              disabled={loading || !!formInvalidMessage}
              className={submitButton}
            >
              {loading ? "Creando..." : "Crear Envío"}
            </button>
            
          </div>
        </form>

        {/* Resultado con estilo de calcular-costo */}
        {result && (
          <div className="mt-8 p-6 border-2 border-[var(--color-primary)] rounded-xl bg-white text-[var(--color-text-dark)]">
            <h3 className="text-xl font-heading font-bold text-[var(--color-primary)] mb-3">Envío Creado con Éxito</h3>
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