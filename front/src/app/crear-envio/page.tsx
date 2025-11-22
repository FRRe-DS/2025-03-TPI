"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
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
import { ChevronDown, Check } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

function emptyProduct(id = 1): ProductItemInput {
  return { id, quantity: 1 };
}

const BackArrowIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
    </svg>
);

export default function CrearEnvioPage() {
  const router = useRouter();
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
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Obtener token del contexto de autenticación
  const { token, isAuthenticated, isLoading } = useAuth();

  // Protección de ruta - redirigir si no está autenticado
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

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
      if (!userId || Number(userId) < 1) return "Debe ingresar un ID de usuario válido.";
      if (!address.street.trim()) return "El campo 'Calle' es obligatorio.";
      if (!address.city.trim()) return "El campo 'Ciudad' es obligatorio.";
      if (!address.state.trim()) return "El campo 'Provincia' es obligatorio.";
      if (!address.country.trim()) return "El campo 'País' es obligatorio.";
      if (!address.postal_code.trim()) return "El campo 'Código Postal' es obligatorio.";
      if (!transportMethod.trim()) return "El campo 'Método de transporte' es obligatorio.";
      if (products.length === 0) return "Agregue al menos un producto.";
      for (const p of products) {
          if (!p.id || p.id < 1) return `Debe ingresar un ID válido para el producto (Valor actual: ${p.id || 0}).`;
          if (!p.quantity || p.quantity < 1) return `Debe ingresar una cantidad válida para el producto (Valor actual: ${p.quantity || 0}).`;
      }
      return null;
  };

  const getInvalidCharacterError = (): string | null => {
    const hasLettersRegex = /[a-zA-Z]/;

    if (!hasLettersRegex.test(address.street.trim())) return "El valor ingresado en el campo 'Calle' debe ser válido.";
    if (!hasLettersRegex.test(address.city.trim())) return "El valor ingresado en el campo 'Ciudad' debe ser válido.";
    if (!hasLettersRegex.test(address.state.trim())) return "El valor ingresado en el campo 'Provincia' debe ser válido.";
    if (!hasLettersRegex.test(address.country.trim())) return "El valor ingresado en el campo 'País' debe ser válido.";
    return null;
  };
  
  useEffect(() => {
  setFormInvalidMessage(getValidationError()); 
  }, [userId, address, products, transportMethod]); 

  const onSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);
    setResult(null);

    const invalidCharError = getInvalidCharacterError();
    if (invalidCharError) {
        setSubmitError(invalidCharError);
        return;
    }

    const validationCheck = getValidationError();
    if (validationCheck) {
      setError(validationCheck); 
      return;
    }
    
    const data: ShippingCreationRequest = {
      order_id: 123, // Este ID podría necesitar ser dinámico también si el backend lo valida
      user_id: Number(userId), 
      delivery_address: address,
      products,
      transport_type: transportMethod,
    };

    console.log("On submit data", data);

    try {
      setLoading(true);
      const resp = await crearEnvio(data, token); 
      setResult(resp);
    } catch (err: any) {
      console.error(err);
      // Muestra el mensaje de error capturado desde el servicio
      setError(err.message || "Ocurrió un error al crear el envío. Intenta nuevamente más tarde.");
    } finally {
      setLoading(false);
    }
  };
  
  const inputStyle = "mt-1 p-2 border border-[var(--color-gray)] rounded-md outline-none focus:ring-0 focus:border-[var(--color-primary)] transition-colors duration-200 w-full bg-white text-[var(--color-text-dark)]";
  const inputErrorStyle = "mt-1 p-2 border border-red-500 rounded-md outline-none focus:ring-0 focus:border-red-500 transition-colors duration-200 w-full bg-red-50 text-[var(--color-text-dark)]";
  
  const labelStyle = "text-sm text-[var(--color-text-dark)] font-medium";
  const baseOutlineButton = "cursor-pointer border-2 border-[var(--color-primary)] text-[var(--color-primary)] bg-white rounded-full font-semibold hover:bg-[var(--color-primary)] hover:text-[var(--color-light)] transition-colors duration-300 disabled:opacity-60";
  const submitButton = `cursor-pointer px-5 py-2 bg-[var(--color-primary)] text-[var(--color-light)] rounded-full font-semibold border-2 border-[var(--color-primary)] shadow-md hover:shadow-xl hover:scale-105 transform transition-all duration-300 disabled:opacity-60`;
  const clearButton = `px-5 py-2 ${baseOutlineButton}`;
  const smallButton = `px-3 py-1 text-xs ${baseOutlineButton}`;

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)] mx-auto"></div>
          <p className="mt-4 text-[var(--color-text-dark)]">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
        className="min-h-screen bg-slate-100 py-12 text-[var(--color-text-dark)] flex items-center justify-center"
    >
      <div className="max-w-4xl w-full mx-auto p-8 bg-white shadow-xl rounded-xl border border-[var(--color-gray)]">
        
        <h1 className="text-3xl font-heading font-bold text-[var(--color-primary)]">Crear Nuevo Envío</h1>
        <p className="text-sm text-[var(--color-text-dark)] opacity-80 mb-6">
          Complete los detalles y el ID de usuario para crear el envío.
        </p>

        <form onSubmit={onSubmit} className="space-y-8">
        
          {/* ID de Usuario con Error Absoluto */}
          <label className="flex flex-col relative">
            <span className="text-sm text-gray-700 font-bold">ID de Usuario (user_id)</span>
            <input
              type="number"
              value={userId}
              onChange={(e) => { setUserId(e.target.value); setError(null); }}
              className={Number(userId) <= 0 ? inputErrorStyle : inputStyle}
              placeholder="Ej: 456"
            />
            {Number(userId) <= 0 && (
              <span className="absolute -bottom-5 left-0 text-[10px] text-red-500 font-medium">
                El ID debe ser mayor a 0
              </span>
            )}
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


            {/* Método de transporte (Custom Select) */}
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
                        setError(null);
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
                          setError(null);
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
                  // Contenedor de producto con estilo relativo para el error flotante
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
          
          {/* Contenedor de errores generales */}
          {(error || submitError) && (
            <div className="text-sm p-3 bg-red-100 border border-red-300 text-red-700 rounded-md">
              {error || submitError}
            </div>
          )}

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
              disabled={loading || !!formInvalidMessage}
              className={submitButton }
            >
              {loading ? "Creando..." : "Crear Envío"}
            </button>
            
          </div>
        </form>

        {/* Resultado (solo se muestra si NO hay error y la API devuelve éxito) */}
        {result && (
          <div className="mt-8 p-6 border-2 border-[var(--color-primary)] rounded-xl bg-white text-[var(--color-text-dark)]">
            <h3 className="text-xl font-heading font-bold text-[var(--color-primary)] mb-3">Envío Creado con Éxito</h3>
            <p>
              <strong>ID del Envío:</strong> {result?.shipping_id ?? ""}
            </p>
            <p>
              <strong>Estado:</strong> {result?.status?.toUpperCase() ?? ""}
            </p>
            <p>
              <strong>Tipo de Transporte:</strong> {getTransportMethodName(result?.transport_type ?? "")}
            </p>
            <p>
              <strong>Fecha de entrega estimada:</strong> {result?.estimated_delivery_at} dias
            </p>
          </div>
        )}
      </div>
    </div>
  );
}