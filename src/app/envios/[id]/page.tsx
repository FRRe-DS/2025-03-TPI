"use client";
import { useEffect, useState } from "react";
import { getEnvio } from "../../services/logistica-mock";

export default function EnvioPage({ params }: { params: { id: string } }) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    getEnvio(Number(params.id)).then(setData);
  }, [params.id]);

  if (!data) return <p>Cargando...</p>;

  return (
    <div>
      <h1>Envío #{data.shipping_id}</h1>
      <p>Estado: {data.status}</p>
      <p>ETA: {data.estimated_delivery_at}</p>
    </div>
  );
}