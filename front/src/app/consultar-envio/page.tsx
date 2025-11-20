"use client";

import { useState, useEffect } from "react";
import type { ComponentProps } from "react";
import Link from "next/link";
import { getEnvio } from "../services/logistica-backend"; 
import { ShippingResponse } from "@/types/logistica";

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

interface Direccion {
  calle: string;
  ciudad: string;
  provincia: string;
  codigo_postal: string;
  pais: string;
}

interface Producto {
  id_producto: number;
  cantidad: number;
}

interface Registro {
  fecha: string;
  estado: string;
  mensaje: string;
}

interface Envio {
  id_envio: number;
  id_orden: number;
  id_usuario: number;
  direccion_entrega: Direccion;
  direccion_salida: Direccion;
  productos: Producto[];
  estado: string;
  tipo_transporte: string;
  numero_seguimiento: string;
  transportista: string;
  costo_total: number;
  moneda: string;
  fecha_entrega_estimado: string;
  fecha_creacion: string;
  fecha_actualizacion: string;
  registros: Registro[];
}

export default function ConsultarEnvioPage() {
  const [idEnvio, setIdEnvio] = useState<string>("");
  const [expandido, setExpandido] = useState<number | null>(null);
  const [envios, setEnvios] = useState<ShippingResponse[]>([]);

  useEffect(() => {
      const data = getEnvio() 
  }, []);

  const enviosFiltrados = idEnvio
    ? envios.filter((e) =>
        e.shipping_id.toString().includes(idEnvio.trim())
      )
    : envios;

  const alternarExpandido = (id: number) => {
    setExpandido(expandido === id ? null : id);
  };

  const estiloInput =
    "mt-1 p-2 border border-[var(--color-gray)] rounded-md focus:ring-0 focus:border-[var(--color-primary)] transition-colors duration-200 w-full bg-white";
  const estiloLabel = "text-sm text-[var(--color-text-dark)] font-medium";

  return (
    <div className="bg-gray-100 py-12 text-[var(--color-text-dark)] flex justify-center">
      <div className="max-w-4xl w-full mx-auto p-8 bg-white shadow-xl rounded-xl border border-[var(--color-gray)]">
        <div className="flex items-center mb-4">
          <Link href="/" passHref className="mr-4">
            <button
              className="p-2 rounded-full text-[var(--color-primary)] hover:bg-gray-200/75 hover:scale-110 transform transition-all duration-300 cursor-pointer"
              aria-label="Volver a la página de inicio"
            >
              <BackArrowIcon className="w-6 h-6" />
            </button>
          </Link>
          <h1 className="text-3xl font-heading font-bold text-[var(--color-primary)]">
            Consultar Envío
          </h1>
        </div>

        <label className="flex flex-col mb-6">
          <span className={estiloLabel}>Buscar por ID de Envío</span>
          <input
            value={idEnvio}
            onChange={(e) => setIdEnvio(e.target.value)}
            className={estiloInput}
            placeholder="Ej: 7633"
          />
        </label>

        <div className="mt-8 space-y-2">
          {enviosFiltrados.length > 0 ? (
            enviosFiltrados.map((envio) => (
              <div
                key={envio.shipping_id}
                className="p-4 bg-white rounded-xl shadow-md hover:shadow-lg transform transition-all duration-300 border border-gray-100 cursor-pointer"
                onClick={() => alternarExpandido(envio.shipping_id)}
              >
                {/* Línea resumida */}
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-[var(--color-primary)]">
                    Envío #{envio.shipping_id} - {envio.status}
                  </span>
                  <span className="text-gray-500">
                    {new Date(envio.estimated_delivery_at).toLocaleDateString()}
                  </span>
                </div>

                {/* Detalles expandibles */}
                {expandido === envio.shipping_id && (
                  <div className="mt-4 space-y-2 text-sm text-[var(--color-text-dark)]">
                    <p><strong>Orden:</strong> {envio.orden_id}</p>
                    <p><strong>Tipo de transporte:</strong> {envio.transport_type}</p>
    {/*                <p><strong>Dirección de entrega:</strong> {`${envio.direccion_entrega.calle}, ${envio.direccion_entrega.ciudad}, ${envio.direccion_entrega.provincia}, ${envio.direccion_entrega.codigo_postal}, ${envio.direccion_entrega.pais}`}</p>
                    <p><strong>Dirección de salida:</strong> {`${envio.direccion_salida.calle}, ${envio.direccion_salida.ciudad}, ${envio.direccion_salida.provincia}, ${envio.direccion_salida.codigo_postal}, ${envio.direccion_salida.pais}`}</p>
                    <p><strong>Total:</strong> {envio.costo_total} {envio.moneda}</p>
                    <p><strong>Número de seguimiento:</strong> {envio.numero_seguimiento}</p>
                    <p><strong>Transportista:</strong> {envio.transportista}</p> 

                    <div>
                      <strong>Productos:</strong>
                      <ul className="list-disc list-inside ml-4">
                        {envio.productos.map((p) => (
                          <li key={p.id_producto}>Producto #{p.id_producto} - Cantidad: {p.cantidad}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <strong>Historial de envíos:</strong>
                      <ul className="list-disc list-inside ml-4">
                        {envio.registros.map((log, index) => (
                          <li key={index}>
                            [{new Date(log.fecha).toLocaleString()}] {log.estado} - {log.mensaje}
                          </li>
                        ))}
                      </ul>
                    </div>
                    */}
                  </div>
                  
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-center">
              No se encontraron envíos con ese ID.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
