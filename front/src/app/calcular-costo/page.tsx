"use client";

import { useState } from "react";
import Link from "next/link";
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

// Componente de Flecha de Volver
const BackArrowIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
    </svg>
);

export default function CalcularCostoPage() {
  // CAMBIO CLAVE 1: Inicializamos todos los campos como cadenas vacías ("")
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
    if (!address.street.trim()) return "La Calle es requerida.";
    if (!address.city.trim()) return "La Ciudad es requerida.";
    if (!address.postal_code.trim()) return "El Código Postal es requerido.";
    if (products.length === 0) return "Agregue al menos un producto.";
    for (const p of products) {
      if (p.id < 1) return "El ID del Producto debe ser >= 1.";
      if (p.quantity < 1) return "La Cantidad del Producto debe ser >= 1.";
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
        departure_postal_code: "1000",
        products,
    };

    try {
      setLoading(true);
      const resp = await calcularCosto(data);
      setResult(resp);
    } catch (err) {
      console.error(err);
      setError("Error al calcular el costo. Intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };
  
  // Clases de estilo reutilizables
  // Nota: Tailwind aplica automáticamente un color gris pálido y transparente a los placeholders.
  const inputStyle = "mt-1 p-2 border border-[var(--color-gray)] rounded-md focus:ring-0 focus:border-[var(--color-primary)] transition-colors duration-200 w-full bg-[var(--color-light)]";
  const labelStyle = "text-sm text-[var(--color-text-dark)] font-medium";
  
  // Estilo Base: Contorno Primario (Limpia resultado)
  const baseOutlineButton = "border-2 border-[var(--color-primary)] text-[var(--color-primary)] bg-[var(--color-light)] rounded-full font-semibold hover:bg-[var(--color-primary)] hover:text-[var(--color-light)] transition-colors duration-300 disabled:opacity-60";
  
  // 1. Estilo para Botón Calcular Costo (MISMO TAMAÑO PERO CON RELLENO PRIMARIO)
  const calculateButton = `px-5 py-2 bg-[var(--color-primary)] text-[var(--color-light)] rounded-full font-semibold border-2 border-[var(--color-primary)] hover:bg-[var(--color-secondary)] hover:border-[var(--color-secondary)] transition-colors duration-300 disabled:opacity-60`;

  // 2. Estilo para Botón Limpiar Resultado (TAMAÑO BASE: px-5 py-2)
  const clearButton = `px-5 py-2 ${baseOutlineButton}`;

  // 3. Estilo para Botones Agregar/Eliminar (Tamaño pequeño)
  const smallButton = `px-3 py-1 text-xs ${baseOutlineButton}`; 


  return (
    <div 
        className="min-h-screen bg-[var(--color-bg)] py-12 text-[var(--color-text-dark)] flex items-center justify-center" 
    >
      <div className="max-w-4xl w-full mx-auto p-8 bg-[var(--color-light)] shadow-xl rounded-xl border border-[var(--color-gray)]"> 
        
        {/* Encabezado con Botón Volver a la izquierda */}
        <div className="flex items-center mb-4">
            <Link href="/" passHref className="mr-4">
                <button 
                    className="p-1 rounded-full text-[var(--color-primary)] hover:bg-[var(--color-light)] transition-colors duration-300"
                    aria-label="Volver a la página de inicio"
                >
                    <BackArrowIcon />
                </button>
            </Link>
            <h1 className="text-3xl font-heading font-bold text-[var(--color-primary)]">Calcular Costo de Envío</h1>
        </div>
        
        <p className="text-sm text-[var(--color-text-dark)] opacity-80 mb-6">
          Complete la dirección y los productos para simular el costo.
        </p>

        <form onSubmit={onSubmit} className="space-y-8">
          
          {/* Dirección */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <label className="flex flex-col">
              <span className={labelStyle}>Calle</span>
              <input
                value={address.street}
                onChange={(e) => setAddress({ ...address, street: e.target.value })}
                className={inputStyle}
                placeholder="Av. Siempre Viva 123" // CAMBIO CLAVE 2: Mover el texto a placeholder
              />
            </label>

            <label className="flex flex-col">
              <span className={labelStyle}>Ciudad</span>
              <input
                value={address.city}
                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                className={inputStyle}
                placeholder="Resistencia" // CAMBIO CLAVE 2: Mover el texto a placeholder
              />
            </label>

            <label className="flex flex-col">
              <span className={labelStyle}>Provincia</span>
              <input
                value={address.state}
                onChange={(e) => setAddress({ ...address, state: e.target.value })}
                className={inputStyle}
                placeholder="Chaco" // CAMBIO CLAVE 2: Mover el texto a placeholder
              />
            </label>

            <label className="flex flex-col">
              <span className={labelStyle}>Código Postal</span>
              <input
                value={address.postal_code}
                onChange={(e) => setAddress({ ...address, postal_code: e.target.value })}
                className={inputStyle}
                placeholder="3500" // CAMBIO CLAVE 2: Mover el texto a placeholder
              />
            </label>

            <label className="flex flex-col">
              <span className={labelStyle}>País</span>
              <input
                value={address.country} // Mantenemos el valor "AR" ya que es un valor fijo (readonly)
                onChange={(e) => setAddress({ ...address, country: e.target.value })}
                className={inputStyle}
                placeholder="AR"
                readOnly
              />
            </label>
          </div>

          {/* Productos */}
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
                  className="p-4 border border-[var(--color-gray)] rounded-lg grid grid-cols-5 md:grid-cols-5 gap-4 items-end bg-[var(--color-light)]/50" 
                >
                  <div className="col-span-2">
                    <label className="text-xs text-[var(--color-text-dark)] opacity-75">ID Producto</label>
                    <input
                      type="number"
                      min={1}
                      value={p.id} // Mantenemos el valor inicial de "1" para ID y Cantidad si es necesario
                      onChange={(e) =>
                        updateProduct(i, { id: Math.max(1, Number(e.target.value)) })
                      }
                      className={inputStyle.replace('p-2', 'p-1')}
                      placeholder="Ej: 456" // Añadimos placeholders aquí también
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="text-xs text-[var(--color-text-dark)] opacity-75">Cantidad</label>
                    <input
                      type="number"
                      min={1}
                      value={p.quantity} // Mantenemos el valor inicial de "1" si es necesario
                      onChange={(e) =>
                        updateProduct(i, { quantity: Math.max(1, Number(e.target.value)) })
                      }
                      className={inputStyle.replace('p-2', 'p-1')}
                      placeholder="Ej: 5" // Añadimos placeholders aquí también
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
          
          {/* Mensajes y Botones de Acción */}
          {error && <div className="text-sm p-3 bg-red-100 border border-red-300 text-red-700 rounded-md">{error}</div>}

          {/* Distribución de botones: AMBOS A LA IZQUIERDA */}
          <div className="flex items-center gap-4 pt-4 border-t border-[var(--color-gray)]">
            
            {/* Botón Limpiar (Izquierda) */}
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
            
            {/* Botón Calcular Costo (A su lado, con relleno) */}
            <button
              type="submit"
              disabled={loading}
              className={calculateButton}
            >
              {loading ? "Calculando..." : "Calcular Costo"}
            </button>
            
          </div>
        </form>

        {/* Resultado */}
        {result && (
          <div className="mt-8 p-6 border-2 border-[var(--color-primary)] rounded-xl bg-[var(--color-light)] text-[var(--color-text-dark)]">
            <h3 className="text-xl font-heading font-bold text-[var(--color-primary)] mb-3">Resultado de Simulación</h3>
            <p className="text-lg">
              <strong>Total Estimado:</strong> <span className="text-[var(--color-secondary)] font-bold">{result.total_cost} {result.currency}</span>
            </p>
            <p>
              <strong>Tipo de Transporte:</strong> {result.transport_type}
            </p>

            <div className="mt-4 pt-4 border-t border-[var(--color-primary)]/20">
              <h4 className="font-heading font-medium">Desglose por Producto</h4>
              <ul className="mt-2 space-y-1">
                {result.products.map((pr) => (
                  <li key={pr.id} className="flex justify-between text-sm">
                    <span>Producto ID #{pr.id}</span>
                    <span className="font-medium">{pr.cost} {result.currency}</span>
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