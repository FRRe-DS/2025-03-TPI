"use client"; // Necesario si usamos hooks o estados

import Link from "next/link";

export default function HomePage() {
  return (
    <div className="container">
      <header>
        <h1>Logística UTN</h1>
        <p>Portal de gestión de envíos y logística</p>
      </header>

      <main>
        <div className="cards">
          <Link href="/calcular-costo" className="card">
            <h2>Calcular Costo</h2>
            <p>Simulá el costo de envío de tus productos</p>
          </Link>

          <Link href="/crear-envio" className="card">
            <h2>Crear Envío</h2>
            <p>Generá un nuevo envío y reservá stock</p>
          </Link>

          <Link href="/envios/789" className="card">
            <h2>Consultar Envío</h2>
            <p>Seguimiento de tus envíos por ID</p>
          </Link>
        </div>
      </main>
    </div>
  );
}
