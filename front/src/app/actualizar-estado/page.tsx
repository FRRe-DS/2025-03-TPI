"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { consultarEnvio, actualizarEstadoEnvio } from "@/app/services/logistica-backend";

const allowedTransitions: Record<string, string[]> = {
  created: ["reserved", "cancelled"],
  reserved: ["in_transit", "cancelled"],
  in_transit: ["in_distribution"],
  in_distribution: ["arrived"],
  arrived: ["delivered"],
  delivered: [],
  cancelled: [],
};


export default function ActualizarEstadoPage() {
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

    } catch (err: any) {
      setError(err.message || "Error al actualizar el estado.");
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

          <div>
            <label className="block mb-1 font-semibold">Nuevo estado:</label>
            <select
              className="w-full border p-2 rounded"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <option value="">Seleccione un estado</option>
              {nextStates.map((state) => (
                <option key={state} value={state}>
                  {state.toString()}
                </option>
              ))}
            </select>
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
