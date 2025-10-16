"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-[var(--color-bg)] text-[var(--color-text-dark)]  transition-colors duration-300 dark:bg-[var(--color-bg-dark)] dark:text-[var(--color-text-light)]">
     {/* Hero Banner */}
      <section
        className="relative w-screen h-[85vh] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/heroBanner.png')" }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/25 dark:bg-black/40"></div>

        {/* Texto del Hero */}
       <div className="relative z-10 text-center px-4 max-w-3xl">
          <h2 className="text-5xl md:text-6xl font-heading font-bold text-[var(--color-light)] mb-4 leading-tight">
            Tu carga, nuestro compromiso.
          </h2>
          <p className="text-xl md:text-2xl text-[var(--color-light)] opacity-90 leading-relaxed">
            Logística inteligente para un mundo que no se detiene.
          </p>
        </div>
      </section>

      {/* Cards */}
      <main className="flex flex-wrap justify-center gap-8 mt-16 mb-20">
        {/* Card 1 */}
        <Link
          href="/calcular-costo"
          className="group w-64 p-8 bg-white border-2 border-[var(--color-gray)] rounded-3xl shadow-md hover:shadow-xl hover:bg-[var(--color-light)] transform hover:-translate-y-2 transition-all duration-300 text-center 
          dark:bg-[var(--color-card-dark)] dark:border-[var(--color-card-border-dark)] dark:hover:bg-[var(--color-card-hover-dark)] "
        >
          <h2 className="text-2xl font-semibold text-[var(--color-primary)] group-hover:text-[var(--color-secondary)] mb-3 dark:text-[var(--color-primary)]">
            Calcular Costo
          </h2>
          <p className="text-sm text-[var(--color-secondary)] group-hover:text-[var(--color-text-light)] transition-colors duration-300 dark:text-[var(--color-secondary)] dark:group-hover:text-[var(--color-text-light)]">
            Simulá el costo de envío de tus productos
          </p>
        </Link>

        {/* Card 2 */}
        <Link
          href="#"
          className="group w-64 p-8 bg-white border-2 border-[var(--color-gray)] rounded-3xl shadow-md hover:shadow-xl hover:bg-[var(--color-light)] transform hover:-translate-y-2 transition-all duration-300 text-center 
          dark:bg-[var(--color-card-dark)] dark:border-[var(--color-card-border-dark)] dark:hover:bg-[var(--color-card-hover-dark)] "
        >
          <h2 className="text-2xl font-semibold text-[var(--color-primary)] group-hover:text-[var(--color-secondary)] mb-3 dark:text-[var(--color-primary)]">
            Crear Envío
          </h2>
          <p className="text-sm text-[var(--color-secondary)] group-hover:text-[var(--color-text-light)] transition-colors duration-300 dark:text-[var(--color-secondary)] dark:group-hover:text-[var(--color-text-light)]">
            Generá un nuevo envío y reservá stock
          </p>
        </Link>

        {/* Card 3 */}
        <Link
          href="#"
          className="group w-64 p-8 bg-white border-2 border-[var(--color-gray)] rounded-3xl shadow-md hover:shadow-xl hover:bg-[var(--color-light)] transform hover:-translate-y-2 transition-all duration-300 text-center 
          dark:bg-[var(--color-card-dark)] dark:border-[var(--color-card-border-dark)] dark:hover:bg-[var(--color-card-hover-dark)] "
        >
          <h2 className="text-2xl font-semibold text-[var(--color-primary)] group-hover:text-[var(--color-secondary)] mb-3 dark:text-[var(--color-primary)]">
            Consultar Envío
          </h2>
          <p className="text-sm text-[var(--color-secondary)] group-hover:text-[var(--color-text-light)] transition-colors duration-300 dark:text-[var(--color-secondary)] dark:group-hover:text-[var(--color-text-light)]">
            Seguimiento de tus envíos por ID
          </p>
        </Link>
      </main>
    </div>
  );
}
