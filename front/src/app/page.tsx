"use client"

import Link from "next/link"

const PackageIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
    />
  </svg>
)

const SendIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
)

const SearchIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
)

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gray-100 text-slate-900 transition-colors duration-300">
      <section
        className="relative w-screen h-[100vh] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/heroBanner.png')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/60"></div>
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-slate-100 to-transparent z-10"></div>
        <div className="relative z-10 text-center px-6 max-w-4xl">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-[1.1] tracking-tight text-balance">
            Tu carga, nuestro compromiso.
          </h1>
          <p className="text-xl md:text-2xl lg:text-3xl text-white/95 font-light leading-relaxed text-pretty">
            Logística inteligente para un mundo que no se detiene.
          </p>
        </div>
      </section>

      <main className="w-full max-w-7xl px-6 flex flex-wrap justify-center gap-8 -mt-24 mb-32 relative z-20">
        {/* Card 1 - Calcular Costo */}
        <Link
          href="/calcular-costo"
          className="group relative w-full sm:w-80 lg:w-96 p-10 bg-white border border-slate-200 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-3 transition-all duration-500 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          <div className="relative z-10">
            <div className="w-14 h-14 mb-6 rounded-xl bg-red-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
              <PackageIcon className="w-7 h-7 text-red-800" />
            </div>

            <h2 className="text-3xl font-bold text-slate-900 group-hover:text-red-800 mb-4 transition-colors duration-300">
              Calcular Costo
            </h2>
            <p className="text-base text-slate-600 leading-relaxed">
              Calculá el costo de envío de tus productos de manera rápida y precisa
            </p>
          </div>
        </Link>

        {/* Card 2 - Crear Envío */}
        <Link
          href="/crear-envio"
          className="group relative w-full sm:w-80 lg:w-96 p-10 bg-white border border-slate-200 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-3 transition-all duration-500 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          <div className="relative z-10">
            <div className="w-14 h-14 mb-6 rounded-xl bg-red-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
              <SendIcon className="w-7 h-7 text-red-800" />
            </div>

            <h2 className="text-3xl font-bold text-slate-900 group-hover:text-red-800 mb-4 transition-colors duration-300">
              Crear Envío
            </h2>
            <p className="text-base text-slate-600 leading-relaxed">
              Generá un nuevo envío y reservá stock en tiempo real
            </p>
          </div>
        </Link>

        {/* Card 3 - Consultar Envío */}
        <Link
          href="/consultar-envio"
          className="group relative w-full sm:w-80 lg:w-96 p-10 bg-white border border-slate-200 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-3 transition-all duration-500 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          <div className="relative z-10">
            <div className="w-14 h-14 mb-6 rounded-xl bg-red-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
              <SearchIcon className="w-7 h-7 text-red-800" />
            </div>

            <h2 className="text-3xl font-bold text-slate-900 group-hover:text-red-800 mb-4 transition-colors duration-300">
              Consultar Envío
            </h2>
            <p className="text-base text-slate-600 leading-relaxed">
              Seguimiento completo de tus envíos por ID en tiempo real
            </p>
          </div>
        </Link>
      </main>
    </div>
  )
}