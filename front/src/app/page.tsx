"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-b from-blue-50 via-white to-blue-50 font-archivo p-6 pt-20">
      <header className="text-center mb-12 mt-10">
        <h1 className="text-5xl md:text-6xl font-bold text-blue-700 text-brand mb-4">Logística UTN</h1>
        <p className="text-lg md:text-xl">Portal de gestión de envíos y logística</p>
      </header>

      <main className="flex flex-wrap justify-center gap-8">
        {/* Card 1 */}
        <Link
          href="/calcular-costo"
          className="w-64 p-8 bg-white border-2 border-blue-200 rounded-3xl shadow-md hover:shadow-xl hover:bg-gradient-to-r hover:from-blue-100 hover:to-blue-50 transform hover:-translate-y-2 transition-all duration-300 text-center"
        >
          <h2 className="text-2xl font-semibold text-blue-600 mb-3">Calcular Costo</h2>
          <p className="text-gray-700 text-sm">Simulá el costo de envío de tus productos</p>
        </Link>

        {/* Card 2 */}
        <Link
          href="/crear-envio"
          className="w-64 p-8 bg-white border-2 border-blue-200 rounded-3xl shadow-md hover:shadow-xl hover:bg-gradient-to-r hover:from-blue-100 hover:to-blue-50 transform hover:-translate-y-2 transition-all duration-300 text-center"
        >
          <h2 className="text-2xl font-semibold text-blue-600 mb-3">Crear Envío</h2>
          <p className="text-gray-700 text-sm">Generá un nuevo envío y reservá stock</p>
        </Link>

        {/* Card 3 */}
        <Link
          href="#"
          className="w-64 p-8 bg-white border-2 border-blue-200 rounded-3xl shadow-md hover:shadow-xl hover:bg-gradient-to-r hover:from-blue-100 hover:to-blue-50 transform hover:-translate-y-2 transition-all duration-300 text-center"
        >
          <h2 className="text-2xl font-semibold text-blue-600 mb-3">Consultar Envío</h2>
          <p className="text-gray-700 text-sm">Seguimiento de tus envíos por ID</p>
        </Link>
      </main>
    </div>
  );
}
