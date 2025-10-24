"use client";

import { useState } from "react";
import type { ComponentProps } from "react";
import Link from "next/link";

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

  const enviosMock: Envio[] = [
    {
      id_envio: 7633,
      id_orden: 701,
      id_usuario: 456,
      direccion_entrega: {
        calle: "Av. Siempre Viva 123",
        ciudad: "Resistencia",
        provincia: "Chaco",
        codigo_postal: "H3500ABC",
        pais: "Argentina",
      },
      direccion_salida: {
        calle: "Almacén Central",
        ciudad: "Resistencia",
        provincia: "Chaco",
        codigo_postal: "H3500XYZ",
        pais: "Argentina",
      },
      productos: [
        { id_producto: 12, cantidad: 2 },
        { id_producto: 22, cantidad: 1 },
      ],
      estado: "En distribución",
      tipo_transporte: "Aéreo",
      numero_seguimiento: "LOG-AR-123456789",
      transportista: "Express Logistics SA",
      costo_total: 45.5,
      moneda: "ARS",
      fecha_entrega_estimado: "2025-10-23T00:00:00Z",
      fecha_creacion: "2025-09-01T10:00:00Z",
      fecha_actualizacion: "2025-09-15T09:29:00Z",
      registros: [
        { fecha: "2025-09-15T09:29:00Z", estado: "En distribución", mensaje: "El envío está en distribución" },
        { fecha: "2025-09-12T09:27:00Z", estado: "Llegó al destino", mensaje: "Paquete llegó a la oficina de entrega" },
      ],
    },
    {
      id_envio: 7634,
      id_orden: 702,
      id_usuario: 456,
      direccion_entrega: {
        calle: "Calle Falsa 456",
        ciudad: "Resistencia",
        provincia: "Chaco",
        codigo_postal: "H3501ABC",
        pais: "Argentina",
      },
      direccion_salida: {
        calle: "Almacén Norte",
        ciudad: "Resistencia",
        provincia: "Chaco",
        codigo_postal: "H3502XYZ",
        pais: "Argentina",
      },
      productos: [{ id_producto: 31, cantidad: 3 }],
      estado: "Entregado",
      tipo_transporte: "Terrestre",
      numero_seguimiento: "LOG-AR-987654321",
      transportista: "Transporte Seguro SA",
      costo_total: 30.0,
      moneda: "ARS",
      fecha_entrega_estimado: "2025-10-22T00:00:00Z",
      fecha_creacion: "2025-09-05T14:30:00Z",
      fecha_actualizacion: "2025-09-22T11:00:00Z",
      registros: [
        { fecha: "2025-09-22T11:00:00Z", estado: "Entregado", mensaje: "El envío fue entregado" },
        { fecha: "2025-09-20T08:00:00Z", estado: "En tránsito", mensaje: "El envío está en tránsito" },
      ],
    },
  ];

  const enviosFiltrados = idEnvio
    ? enviosMock.filter((e) =>
        e.id_envio.toString().includes(idEnvio.trim())
      )
    : enviosMock;

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
                key={envio.id_envio}
                className="p-4 bg-white rounded-xl shadow-md hover:shadow-lg transform transition-all duration-300 border border-gray-100 cursor-pointer"
                onClick={() => alternarExpandido(envio.id_envio)}
              >
                {/* Línea resumida */}
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-[var(--color-primary)]">
                    Envío #{envio.id_envio} - {envio.estado}
                  </span>
                  <span className="text-gray-500">
                    {new Date(envio.fecha_entrega_estimado).toLocaleDateString()}
                  </span>
                </div>

                {/* Detalles expandibles */}
                {expandido === envio.id_envio && (
                  <div className="mt-4 space-y-2 text-sm text-[var(--color-text-dark)]">
                    <p><strong>Orden:</strong> {envio.id_orden}</p>
                    <p><strong>Tipo de transporte:</strong> {envio.tipo_transporte}</p>
                    <p><strong>Dirección de entrega:</strong> {`${envio.direccion_entrega.calle}, ${envio.direccion_entrega.ciudad}, ${envio.direccion_entrega.provincia}, ${envio.direccion_entrega.codigo_postal}, ${envio.direccion_entrega.pais}`}</p>
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
