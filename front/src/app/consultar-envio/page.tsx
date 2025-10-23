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

const SearchIcon = (props: ComponentProps<"svg">) => (
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
      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
    />
  </svg>
);

interface Order {
  order_id: number;
  status: string;
  estimated_delivery_at: string;
  shipment_ids: number;
}

export default function ConsultarEnvioPage() {
  const [shippingId, setShippingId] = useState<string>("");

  const mockShipments: Order[] = [
    {
      order_id: 701,
      status: "En tránsito",
      estimated_delivery_at: "2025-10-23T00:00:00Z",
      shipment_ids: 7633,
    },
    {
      order_id: 702,
      status: "Entregado",
      estimated_delivery_at: "2025-10-22T00:00:00Z",
      shipment_ids: 7634,
    },
    {
      order_id: 703,
      status: "Pendiente",
      estimated_delivery_at: "2025-10-24T00:00:00Z",
      shipment_ids: 7635,
    },
  ];

  const filteredShipments = shippingId
    ? mockShipments.filter((s) =>
        s.order_id.toString().includes(shippingId.trim())
      )
    : mockShipments;

  const inputStyle =
    "mt-1 p-2 border border-[var(--color-gray)] rounded-md focus:ring-0 focus:border-[var(--color-primary)] transition-colors duration-200 w-full bg-white";
  const labelStyle = "text-sm text-[var(--color-text-dark)] font-medium";

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
          <span className={labelStyle}>Buscar por ID</span>
          <input
            value={shippingId}
            onChange={(e) => setShippingId(e.target.value)}
            className={inputStyle}
            placeholder="Ej: 701"
          />
        </label>

        <div className="mt-8 space-y-4">
          {filteredShipments.length > 0 ? (
            filteredShipments.map((envio) => (
              <div
                key={envio.order_id}
                className="p-4 bg-white rounded-xl shadow-md hover:shadow-lg hover:scale-[1.01] transform transition-all duration-300 border border-gray-100"
              >
                <h3 className="text-lg font-semibold text-[var(--color-primary)]">
                  Orden #{envio.order_id}
                </h3>
                <p>
                  <strong>Estado:</strong> {envio.status}
                </p>
                <p>
                  <strong>Entrega estimada:</strong>{" "}
                  {new Date(envio.estimated_delivery_at).toLocaleDateString()}
                </p>
                <p>
                  <strong>ID de Envío:</strong> {envio.shipment_ids}
                </p>
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
