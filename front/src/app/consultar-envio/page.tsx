"use client";

import { useState, useEffect } from "react";
import type { ComponentProps } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import type { ShippingDetail } from "@/types/logistica";
import { consultarEnvio } from "../services/logistica-backend";

const BackArrowIcon = (props: ComponentProps<"svg">) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
    />
  </svg>
);

// Helper para formatear el estado de envío (asumiendo los estados comunes)
const getStatusName = (status: string) => {
    switch (status) {
        case 'PENDING': return 'Pendiente de Procesamiento';
        case 'IN_TRANSIT': return 'En Tránsito';
        case 'DELIVERED': return 'Entregado';
        case 'CANCELLED': return 'Cancelado';
        default: return status;
    }
};

const getTransportMethodName = (type: string) => {
    switch (type) {
        case 'air': return 'Aéreo';
        case 'sea': return 'Marítimo';
        case 'road': return 'Terrestre (Carretera)';
        case 'rail': return 'Ferroviario';
        default: return type;
    }
};

// Helper para formatear la fecha
const formatDate = (dateString: string) => {
    try {
        return new Date(dateString).toLocaleDateString('es-AR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch {
        return dateString;
    }
}

export default function ConsultarEnvioPage() {
  const router = useRouter();
  const [shippingId, setShippingId] = useState<string>("");
  const [result, setResult] = useState<ShippingDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token, isAuthenticated, isLoading } = useAuth();

  type ShortShipping = { shipping_id: string; order_id?: string; status?: string; tracking_number?: string };
  const [shipments, setShipments] = useState<ShortShipping[]>([]);
  const [loadingList, setLoadingList] = useState(false);
  const [listError, setListError] = useState<string | null>(null);

  // Traer lista de envíos al montar 
  useEffect(() => {
    if (!token) return;
    const fetchList = async () => {
      setLoadingList(true);
      setListError(null);
      try {
        const authHeader = token?.startsWith("Bearer ") ? token : `Bearer ${token}`;
        const res = await fetch("http://localhost:3010/shipping?page=1&items_per_page=50", {
        headers: { Authorization: authHeader },
        });
        if (!res.ok) throw new Error("No se pudo obtener la lista de envíos.");
        const data = await res.json();
        // data puede ser { page, total_pages, data: [...] } o directamente un array
        const items = Array.isArray(data)
          ? data
          : data.data ||
            data.items ||
            data.results ||
            data.shipments ||
            [];

        // Normalizar a ShortShipping (shipping_id como string)
        type BackendShipment = {
        shipping_id?: string | number;
        id?: string | number;
        order_id?: string;
        status?: string;
        tracking_number?: string;
        };

        setShipments(
          items.map((it: BackendShipment) => ({
            shipping_id: String(it.shipping_id ?? it.id ?? ""),
            order_id: it.order_id,
            status: it.status ?? "",
            tracking_number: it.tracking_number,
          }))
        );

      } catch (err) {
        setListError((err as Error).message || "Error al cargar envíos.");
      } finally {
        setLoadingList(false);
      }
    };
    fetchList();
  }, [token]);

  // Filtrado en vivo por shippingId (substring)
  const filteredShipments = shipments.filter((s) =>
    shippingId.trim() === "" ? true : s.shipping_id.includes(shippingId.trim())
  );

  // Al seleccionar un envío de la lista, traer sus detalles (usa consultarEnvio existente)
  const handleSelectShipment = async (id: string) => {
    setError(null);
    setResult(null);
    setShippingId(id); // opcional: pone el id en el input
    try {
      setLoading(true);
      const resp = await consultarEnvio(id, token as string | null);
      setResult(resp);
    } catch (err) {
      setError((err as Error).message || "Error al cargar detalle del envío.");
    } finally {
      setLoading(false);
    }
  };

  // Protección de ruta - redirigir si no está autenticado
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  const validate = () => {
    if (!shippingId.trim()) return "El ID del envío es requerido.";
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

    try {
        setLoading(true);
        // 🟢 Llama a la función del servicio con el ID ingresado
        const resp = await consultarEnvio(shippingId, token as string | null); 
        setResult(resp);
    } catch (err) {
        console.error(err);
        setError((err as Error).message || "Error al consultar el envío. Verifique el ID e intente nuevamente.");
    } finally {
        setLoading(false);
    }
  };

  const estiloInput =
    "mt-1 p-2 border border-[var(--color-gray)] rounded-md focus:ring-0 focus:border-[var(--color-primary)] transition-colors duration-200 w-full bg-white";
  const estiloErrorInput = estiloInput.replace('border-[var(--color-gray)]', 'border-red-500'); 
  const estiloLabel = "text-sm text-[var(--color-text-dark)] font-medium";
  const calculateButton = `cursor-pointer px-5 py-2 bg-[var(--color-primary)] text-[var(--color-light)] rounded-full font-semibold border-2 border-[var(--color-primary)] shadow-md hover:shadow-xl hover:scale-105 transform transition-all duration-300 disabled:opacity-60`;
  const clearButton = `cursor-pointer border-2 border-[var(--color-primary)] text-[var(--color-primary)] bg-white rounded-full font-semibold hover:bg-[var(--color-primary)] hover:text-[var(--color-light)] transition-colors duration-300 disabled:opacity-60 px-5 py-2`;

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
    <div className="min-h-screen bg-gray-100 py-12 text-[var(--color-text-dark)] flex justify-center">
      <div className="max-w-4xl w-full mx-auto p-8 bg-white shadow-xl rounded-xl border border-[var(--color-gray)]">
        <div className="flex items-center mb-4">
          <Link href="/" passHref className="mr-4">
            <button
              className="p-2 rounded-full text-[var(--color-primary)] hover:bg-gray-200/75 hover:scale-110 transform transition-all duration-300 cursor-pointer"
              aria-label="Volver a la página de inicio"
            >
              <BackArrowIcon />
            </button>
          </Link>
          <h1 className="text-3xl font-heading font-bold text-[var(--color-primary)]">
            Consultar Estado de Envío
          </h1>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
            <label className="flex flex-col">
                <span className={estiloLabel}>Buscar por ID de Envío</span>
                <input
                    value={shippingId}
                    onChange={(e) => setShippingId(e.target.value)}
                    className={error && !shippingId.trim() ? estiloErrorInput : estiloInput}
                    placeholder="Ej: 7633"
                    disabled={loading}
                />
                {error && !shippingId.trim() && (
                    <span className="text-xs text-red-500 mt-1">{error}</span>
                )}
            </label>

            {error && shippingId.trim() && <div className="text-sm p-3 bg-red-100 border border-red-300 text-red-700 rounded-md font-medium">{error}</div>}

            <div className="flex items-center gap-4 pt-4 border-t border-[var(--color-gray)]">
                <button
                    type="button"
                    onClick={() => {
                        setResult(null);
                        setError(null);
                        setShippingId("");
                    }}
                    className={clearButton} 
                    disabled={loading}
                >
                    Limpiar
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className={calculateButton}
                >
                    {loading ? "Consultando..." : "Consultar Envío"}
                </button>
            </div>

            {/* Lista de envíos - filtrado en vivo por shippingId */}
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2 text-[var(--color-primary)]">Envíos</h3>
              {loadingList ? (
                <div className="text-sm text-gray-500">Cargando envíos...</div>
              ) : listError ? (
                <div className="text-sm text-red-600">{listError}</div>
              ) : (
                <div className="max-h-64 overflow-auto border rounded-md p-2 bg-white">
                  {filteredShipments.length === 0 ? (
                    <div className="text-sm text-gray-500">No hay envíos que coincidan.</div>
                  ) : (
                    <ul className="space-y-2">
                      {filteredShipments.map((s) => (
                        <li key={s.shipping_id}>
                          <button
                            onClick={() => handleSelectShipment(s.shipping_id)}
                            className="w-full text-left p-2 rounded-md hover:bg-gray-100 flex justify-between items-center border"
                          >
                            <div>
                              <div className="font-medium">Envío #{s.shipping_id}</div>
                              <div className="text-xs text-gray-600">{s.order_id ? `Orden ${s.order_id}` : null}</div>
                            </div>
                            <div className="text-sm">
                              <span className={`px-2 py-1 rounded-full text-xs ${s.status === 'delivered' ? 'bg-green-100 text-green-700' : s.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                {s.status ?? "Estado"}
                              </span>
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
        </form>

        {result && (
            <div className="mt-8 p-6 border-2 border-[var(--color-primary)] rounded-xl bg-white text-[var(--color-text-dark)]">
                <h3 className="text-xl font-heading font-bold text-[var(--color-primary)] mb-4">
                    Detalles del Envío #{result.shipping_id} 
                </h3>

                <div className="space-y-3">
                  <p>
                    <strong>Número de Orden:</strong> {result.order_id}
                  </p>
                    <p className="flex items-center gap-2">
                        <strong>Estado Actual:</strong>
                        <span className={`font-bold ${result.status === 'delivered' ? 'text-green-600' : result.status === 'cancelled' ? 'text-red-600' : 'text-orange-600'}`}>
                            {getStatusName(result.status)}
                        </span>
                    </p>
                    <p>
                        <strong>Método de Transporte:</strong> {getTransportMethodName(result.transport_type.type)}
                    </p>  
                    <p className="pt-2">
                        <strong>Costo Total:</strong> 
                        <span className="text-[var(--color-secondary)] font-bold ml-1">
                            {result.total_cost} {result.currency}
                        </span>
                    </p>
                    <p>
                        <strong>Fecha de Entrega Estimada:</strong> {formatDate(result.estimated_delivery_at)}
                    </p>
                    <p>
                        <strong>Número de seguimiento:</strong> {result.tracking_number}
                    </p>
                </div>

                <div className="mt-4 pt-4 border-t border-[var(--color-primary)]/20">
                    <h4 className="font-heading font-medium text-[var(--color-primary)] mb-2">
                        Direcciones
                    </h4>
                    <p className="text-sm mb-2">
                        <strong>Entrega:</strong> {result.delivery_Address.street}, {result.delivery_Address.city} ({result.delivery_Address.postal_code})
                    </p>
                    <p className="text-sm">
                        <strong>Salida:</strong> {result.departure_Address.street}, {result.departure_Address.city} ({result.departure_Address.postal_code})
                    </p>
                </div>
                
                <div className="mt-4 pt-4 border-t border-[var(--color-primary)]/20">
                    <h4 className="font-heading font-medium text-[var(--color-primary)] mb-2">
                        Productos ({result.products.length})
                    </h4>
                    <ul className="space-y-1">
                        {result.products.map((p, index) => (
                            <li key={index} className="text-sm flex justify-between">
                                <span>ID Producto: {p.idProduct}</span> 
                                <span className="font-medium">Cantidad: {p.quantity}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => router.push(`/actualizar-estado?id=${result.shipping_id}`)}
                    className="
                      px-5 py-2 rounded-full font-semibold shadow 
                      bg-[var(--color-primary)] text-[var(--color-light)]
                      hover:scale-105
                      transition-all duration-300
                    "
                  >
                    Actualizar Estado
                  </button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}
