"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { calcularCosto } from "../services/logistica-backend";
import type {
  Address,
  ProductItemInput,
  ShippingCostRequest,
  ShippingCostResponse,
  TransportMethod,
} from "@/types/logistica";
import { getTransportMethodName } from "@/types/transport-methods";
import { API_BASE_URL } from "@/config/api";
import { ChevronDown, Check } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

function emptyProduct(id = 1): ProductItemInput {
  return { id, quantity: 1 };
}

{/* generamos el costo por productos */}
function generarCostosPorProducto(total: number, cantidad: number): number[] {
  if (cantidad <= 0) return [];
  if (cantidad === 1) return [total];

  const costos: number[] = [];
  let restante = total;

  // Generamos valores aleatorios
  for (let i = 0; i < cantidad - 1; i++) {
    const maxPosible = restante - (cantidad - i - 1); // deja espacio mínimo para los demás
    const valor = Math.floor(Math.random() * maxPosible) + 1;
    costos.push(valor);
    restante -= valor;
  }

  // El último producto recibe lo que queda
  costos.push(restante);

  return costos;
}

// Componente de Flecha de Volver
const BackArrowIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
    </svg>
);

export default function CalcularCostoPage() {
  const [address, setAddress] = useState<Address>({
    street: "", 
    city: "",
    state: "",
    postal_code: "",
    country: "AR",
  });
  
  const [transportMethod, setTransportMethod] = useState<string>("");
  const [transportMethods, setTransportMethods] = useState<TransportMethod[]>([]);
  const [products, setProducts] = useState<ProductItemInput[]>([emptyProduct(1)]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ShippingCostResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { token, isAuthenticated, isLoading } = useAuth();

  // Estado para el Custom Select
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
      // Cierra el select si se hace click afuera
      function handleClickOutside(event: MouseEvent) {
        if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
          setIsSelectOpen(false);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
      // Llamada a la api de transportes       
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

  const validate = () => {
    if (!address.street.trim()) return "La Calle es requerida.";
    if (!address.city.trim()) return "La Ciudad es requerida.";
    if (!address.postal_code.trim()) return "El Código Postal es requerido.";
    if (!transportMethod) return "Debe seleccionar un método de transporte.";
    if (products.length === 0) return "Agregue al menos un producto.";
    
    // Validación estricta de productos
    for (const p of products) {
      if (p.id <= 0) return `El ID del producto debe ser mayor a 0 (Error en producto con ID: ${p.id}).`;
      if (p.quantity <= 0) return `La cantidad del producto debe ser mayor a 0 (Error en producto con ID: ${p.id}).`;
      // Check extra por si viene NaN o null
      if (!p.id) return "El ID del producto es requerido."; 
      if (!p.quantity) return "La cantidad del producto es requerida.";
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
        products,
    };

    try {
      setLoading(true);
      const resp = await calcularCosto(data, token as string | null);
      setResult(resp);
    } catch (err) {
      console.error(err);
      setError("Error al calcular el costo. Verifique los datos e intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };
  
  // Estilos base
  const inputStyle = "mt-1 p-2 border border-[var(--color-gray)] rounded-md outline-none focus:ring-0 focus:border-[var(--color-primary)] transition-colors duration-200 w-full bg-white text-[var(--color-text-dark)]";
  const inputErrorStyle = "mt-1 p-2 border border-red-500 rounded-md outline-none focus:ring-0 focus:border-red-500 transition-colors duration-200 w-full bg-red-50 text-[var(--color-text-dark)]";
  
  const labelStyle = "text-sm text-[var(--color-text-dark)] font-medium";
  
  const baseOutlineButton = "cursor-pointer border-2 border-[var(--color-primary)] text-[var(--color-primary)] bg-white rounded-full font-semibold hover:bg-[var(--color-primary)] hover:text-[var(--color-light)] transition-colors duration-300 disabled:opacity-60";
  const calculateButton = `cursor-pointer px-5 py-2 bg-[var(--color-primary)] text-[var(--color-light)] rounded-full font-semibold border-2 border-[var(--color-primary)] shadow-md hover:shadow-xl hover:scale-105 transform transition-all duration-300 disabled:opacity-60`;
  const clearButton = `px-5 py-2 ${baseOutlineButton}`;
  const smallButton = `px-3 py-1 text-xs ${baseOutlineButton}`; 


  return (
    <div className="min-h-screen bg-gray-100 py-12 text-[var(--color-text-dark)] flex items-center justify-center">
      <div className="max-w-4xl w-full mx-auto p-8 bg-white shadow-xl rounded-xl border border-[var(--color-gray)]">
        
        {/* Header */}
        <div className="flex items-center mb-4">
            <Link href="/" passHref className="mr-4">
                <button 
                    className="p-2 rounded-full text-[var(--color-primary)] hover:bg-gray-200/75 hover:scale-110 transform transition-all duration-300 cursor-pointer"
                    aria-label="Volver a la página de inicio"
                >
                    <BackArrowIcon />
                </button>
            </Link>
            <h1 className="text-3xl font-heading font-bold text-[var(--color-primary)]">Calcular Costo de Envío</h1>
        </div>
        
        <p className="text-sm text-[var(--color-text-dark)] opacity-80 mb-6">
          Ingrese los datos del envío para calcular el costo.
        </p>

        <form onSubmit={onSubmit} className="space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Inputs de Dirección */}
            <label className="flex flex-col">
              <span className={labelStyle}>Calle</span>
              <input
                value={address.street}
                onChange={(e) => setAddress({ ...address, street: e.target.value })}
                className={inputStyle}
                placeholder="Av. Siempre Viva 123"
              />
            </label>

            <label className="flex flex-col">
              <span className={labelStyle}>Ciudad</span>
              <input
                value={address.city}
                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                className={inputStyle}
                placeholder="Resistencia"
              />
            </label>

            <label className="flex flex-col">
              <span className={labelStyle}>Provincia</span>
              <input
                value={address.state}
                onChange={(e) => setAddress({ ...address, state: e.target.value })}
                className={inputStyle}
                placeholder="Chaco"
              />
            </label>

            <label className="flex flex-col">
              <span className={labelStyle}>Código Postal</span>
              <input
                value={address.postal_code}
                onChange={(e) => setAddress({ ...address, postal_code: e.target.value })}
                className={inputStyle}
                placeholder="3500"
              />
            </label>

            <label className="flex flex-col">
              <span className={labelStyle}>País</span>
              <input
                value={address.country}
                onChange={(e) => setAddress({ ...address, country: e.target.value })}
                className={inputStyle}
                placeholder="AR"
                readOnly
              />
            </label>

            {/* Custom Select para Método de Transporte */}
            <div className="flex flex-col relative" ref={selectRef}>
              <span className={labelStyle}>Método de transporte</span>
              
              <button
                type="button"
                onClick={() => setIsSelectOpen(!isSelectOpen)}
                className={`mt-1 p-2 border rounded-md w-full bg-white flex justify-between items-center text-left transition-all duration-200
                  ${isSelectOpen ? 'border-[var(--color-primary)] ring-1 ring-[var(--color-primary)]' : 'border-[var(--color-gray)] hover:border-gray-400'}
                `}
              >
                <span className={!transportMethod ? "text-gray-500" : "text-[var(--color-text-dark)]"}>
                  {transportMethod 
                    ? getTransportMethodName(transportMethod) 
                    : "Seleccione un método"}
                </span>
                <ChevronDown 
                  className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${isSelectOpen ? 'transform rotate-180' : ''}`} 
                />
              </button>

              {isSelectOpen && (
                <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-20 max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-100">
                  <ul className="py-1">
                    <li 
                      onClick={() => {
                        setTransportMethod("");
                        setIsSelectOpen(false);
                      }}
                      className="px-3 py-2 text-sm text-gray-500 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
                    >
                      Seleccione un método de transporte
                    </li>
                    {transportMethods.map((method) => (
                      <li
                        key={method.id}
                        onClick={() => {
                          setTransportMethod(method.type);
                          setIsSelectOpen(false);
                        }}
                        className={`px-3 py-2 text-sm cursor-pointer flex justify-between items-center transition-colors duration-150
                          ${transportMethod === method.type 
                            ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-medium' 
                            : 'text-gray-700 hover:bg-[var(--color-primary)] hover:text-white'}
                        `}
                      >
                        {getTransportMethodName(method.type)}
                        {transportMethod === method.type && <Check className="w-4 h-4" />}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Sección de Productos */}
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
                  className="p-4 border border-[var(--color-gray)] rounded-lg grid grid-cols-5 md:grid-cols-5 gap-4 items-end relative" 
                >
                  <div className="col-span-2 relative">
                    <label className="text-xs text-[var(--color-text-dark)] opacity-75">ID Producto</label>
                    <input
                      type="number"
                      value={p.id || ''} 
                      onChange={(e) =>
                        updateProduct(i, { id: Number(e.target.value) })
                      }
                      className={p.id <= 0 ? inputErrorStyle.replace('p-2', 'p-1') : inputStyle.replace('p-2', 'p-1')}
                      placeholder="Ej: 456"
                    />
                    {p.id <= 0 && (
                      <span className="absolute -bottom-5 left-0 text-[10px] text-red-500 font-medium">
                        Debe ser &gt; 0
                      </span>
                    )}
                  </div>

                  <div className="col-span-2 relative">
                    <label className="text-xs text-[var(--color-text-dark)] opacity-75">Cantidad</label>
                    <input
                      type="number"
                      value={p.quantity || ''}
                      onChange={(e) =>
                        updateProduct(i, { quantity: Number(e.target.value) })
                      }
                      className={p.quantity <= 0 ? inputErrorStyle.replace('p-2', 'p-1') : inputStyle.replace('p-2', 'p-1')}
                      placeholder="Ej: 5"
                    />
                    {p.quantity <= 0 && (
                      <span className="absolute -bottom-5 left-0 text-[10px] text-red-500 font-medium">
                        Debe ser &gt; 0
                      </span>
                    )}
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
          
          {error && <div className="text-sm p-3 bg-red-100 border border-red-300 text-red-700 rounded-md font-medium">{error}</div>}

          <div className="flex items-center gap-4 pt-4 border-t border-[var(--color-gray)]">
            
            <button
              type="button"
              onClick={() => {
                setResult(null);
                setError(null);
                setTransportMethod("");
              }}
              className={clearButton} 
            >
              Limpiar resultado
            </button>
            
            <button
              type="submit"
              disabled={loading}
              className={calculateButton}
            >
              {loading ? "Calculando..." : "Calcular Costo"}
            </button>
            
          </div>
        </form>

        {result && (
          <div className="mt-8 p-6 border-2 border-[var(--color-primary)] rounded-xl bg-white text-[var(--color-text-dark)]">
            <h3 className="text-xl font-heading font-bold text-[var(--color-primary)] mb-3">
              Costo Estimado del Envío
            </h3>

            {/* Datos ingresados */}
            <div className="mb-4 space-y-1">
              <p><strong>Calle:</strong> {address.street}</p>
              <p><strong>Ciudad:</strong> {address.city}</p>
              <p><strong>Provincia:</strong> {address.state}</p>
              <p><strong>Código Postal:</strong> {address.postal_code}</p>
              <p><strong>País:</strong> {address.country}</p>
              <p><strong>Método de Transporte:</strong> {getTransportMethodName(transportMethod)}</p>
            </div>

            {/* Resultado del costo */}
            <p className="text-lg mt-2">
              <strong>Total Estimado:</strong>{" "}
              <span className="text-[var(--color-secondary)] font-bold">
                {result.total_cost} {result.currency}
              </span>
            </p>

            {/* Desglose por Producto */}
           <div className="mt-4 pt-4 border-t border-[var(--color-primary)]/20">
              <h4 className="font-heading font-medium text-[var(--color-primary)] mb-2">
                Desglose por Producto
              </h4>
              <ul className="mt-2 space-y-1">
                {(() => {
                  const costos = generarCostosPorProducto(result.total_cost, products.length);
                  return products.map((p, i) => (
                    <li key={i} className="flex justify-between text-sm">
                      <span>
                        Producto ID #{p.id} — Cantidad: {p.quantity}
                      </span>
                      <span className="font-medium">
                        {costos[i]} {result.currency}
                      </span>
                    </li>
                  ));
                })()}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}