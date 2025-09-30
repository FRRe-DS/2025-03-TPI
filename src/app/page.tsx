"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <div className="max-w-3xl mx-auto p-8 text-center">
      <header>
        <h1 className="text-[2.5rem] mb-2 text-brand font-bold">Logística UTN</h1>
        <p className="text-[1.2rem] text-gray-600">Portal de gestión de envíos y logística</p>
      </header>

      <main>
        <div className="flex flex-wrap justify-center gap-6 mt-8">
          <Link href="#" className="block w-[250px] p-6 bg-[#fafafa] border border-gray-200 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-brand">
            <h2 className="mb-2 text-xl text-brand font-semibold">Calcular Costo</h2>
            <p className="text-gray-800 text-[0.95rem]">Simulá el costo de envío de tus productos</p>
          </Link>

          <Link href="#" className="block w-[250px] p-6 bg-[#fafafa] border border-gray-200 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-brand">
            <h2 className="mb-2 text-xl text-brand font-semibold">Crear Envío</h2>
            <p className="text-gray-800 text-[0.95rem]">Generá un nuevo envío y reservá stock</p>
          </Link>

          <Link href="#" className="block w-[250px] p-6 bg-[#fafafa] border border-gray-200 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-brand">
            <h2 className="mb-2 text-xl text-brand font-semibold">Consultar Envío</h2>
            <p className="text-gray-800 text-[0.95rem]">Seguimiento de tus envíos por ID</p>
          </Link>
        </div>
      </main>
    </div>
  );
}
