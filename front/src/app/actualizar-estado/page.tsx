"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { consultarEnvio, actualizarEstadoEnvio } from "@/app/services/logistica-backend";
import { ChevronDown, Check } from "lucide-react";


const allowedTransitions: Record<string, string[]> = {
  created: ["reserved", "cancelled"],
  reserved: ["in_transit", "cancelled"],
  in_transit: ["in_distribution"],
  in_distribution: ["arrived"],
  arrived: ["delivered"],
  delivered: [],
  cancelled: [],
};


function ActualizarEstadoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const shippingId = searchParams.get("id");
  const { token, isAuthenticated, isLoading } = useAuth();

  const [currentStatus, setCurrentStatus] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  // Redirección si no está autenticado
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/");
    }
  }, [isLoading, isAuthenticated, router]);

  // Consultar envío para obtener el estado actual
  useEffect(() => {
    if (!shippingId || !token) return;

    const fetchStatus = async () => {
      try {
        const data = await consultarEnvio(shippingId, token);
       setCurrentStatus(data.status);
      } catch (err) {
        setError("No se pudo obtener el estado del envío.");
      }
    };

    fetchStatus();
  }, [shippingId, token]);

  useEffect(() => {
  function handleClickOutside(event: MouseEvent) {
    if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
      setIsSelectOpen(false);
    }
  }
  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!newStatus) {
      setError("Debe seleccionar un nuevo estado.");
      return;
    }

    try {
      setLoading(true);

      await actualizarEstadoEnvio(
        shippingId!,
        newStatus,
        notes.trim() || null,
        token
      );

      setSuccess("Estado actualizado correctamente.");
      
      setTimeout(() => {
        router.push(`/consultar-envio`);
      }, 2000);

    } catch (err: unknown) {
      setError((err as Error)?.message || "Error al actualizar el estado.");
    } finally {
      setLoading(false);
    }
  };

  if (!shippingId) {
    return <div className="p-8"> No se recibió un ID válido.</div>;
  }

  if (isLoading || currentStatus === null) {
    return <div className="p-8">Cargando...</div>;
  }

  const nextStates = allowedTransitions[currentStatus] || [];

  return (
    <div className="bg-gray-100 py-12 flex justify-center">
      <div className="max-w-xl w-full p-8 bg-white shadow-xl rounded-xl border">

        <h1 className="text-3xl font-bold mb-6 text-[var(--color-primary)]">
          Actualizar Estado del Envío
        </h1>

        <p className="mb-4 text-gray-700">
          <strong>ID del envío:</strong> {shippingId}
        </p>

        <p className="mb-6 text-gray-700">
          <strong>Estado actual:</strong>{" "}
          <span className="font-semibold">{currentStatus}</span>
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 border border-green-300 rounded">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Custom Select: Nuevo Estado */}
            <div className="flex flex-col relative" ref={selectRef}>
              <label className="block mb-1 font-semibold">Nuevo estado:</label>

              <button
                type="button"
                onClick={() => setIsSelectOpen(!isSelectOpen)}
                className={`mt-1 p-2 border rounded-md w-full bg-white flex justify-between items-center text-left transition-all duration-200
                  ${isSelectOpen ? 'border-[var(--color-primary)] ring-1 ring-[var(--color-primary)]' : 'border-gray-300 hover:border-gray-400'}
                `}
              >
                <span className={!newStatus ? "text-gray-500" : "text-[var(--color-text-dark)]"}>
                  {newStatus || "Seleccione un estado"}
                </span>

                <ChevronDown
                  className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${isSelectOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {isSelectOpen && (
                <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-20 max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-100">
                  <ul className="py-1">
                    <li
                      onClick={() => {
                        setNewStatus("");
                        setIsSelectOpen(false);
                      }}
                      className="px-3 py-2 text-sm text-gray-500 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
                    >
                      Seleccione un estado
                    </li>

                    {nextStates.map((state) => (
                      <li
                        key={state}
                        onClick={() => {
                          setNewStatus(state);
                          setIsSelectOpen(false);
                        }}
                        className={`px-3 py-2 text-sm cursor-pointer flex justify-between items-center transition-colors duration-150
                          ${newStatus === state
                            ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-medium'
                            : 'text-gray-700 hover:bg-[var(--color-primary)] hover:text-white'}
                        `}
                      >
                        {state}
                        {newStatus === state && <Check className="w-4 h-4" />}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          <div>
            <label className="block mb-1 font-semibold">Nota (opcional):</label>
            <textarea
              className="w-full border p-2 rounded"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ingrese alguna observación..."
            />
          </div>

          <div className="flex gap-4">

            {/* Botón cancelar */}
            <button
              type="button"
              onClick={() => router.push("/consultar-envio")}
              className="
                w-1/2 py-2 rounded-full font-semibold border-2 
                border-[var(--color-primary)] text-[var(--color-primary)]
                hover:bg-[var(--color-primary)] hover:text-[var(--color-light)]
                transition-all duration-300
              "
            >
              Cancelar
            </button>

            {/* Botón actualizar */}
            <button
              type="submit"
              disabled={loading}
              className="
                w-1/2 py-2 rounded-full font-semibold 
                bg-[var(--color-primary)] text-[var(--color-light)]
                transition-all duration-300
                hover:scale-105
                disabled:opacity-60
              "
            >
              {loading ? "Actualizando..." : "Actualizar Estado"}
            </button>

          </div>
        </form>
      </div>
    </div>
  );
}

export default function ActualizarEstadoPage() {
  return (
    <Suspense fallback={<div className="p-8">Cargando...</div>}>
      <ActualizarEstadoContent />
    </Suspense>
  );
}
