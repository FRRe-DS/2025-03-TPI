"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, isLoading, login, logout } = useAuth(); 

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isLoading) {
    return (
      <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 sm:px-12 py-5 text-[var(--color-text-dark)]">
          <Link href="/">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Logo" className="w-10 h-10" />
              <span className="font-semibold text-lg tracking-wide">EnviGo</span>
            </div>
          </Link>
        </div>
      </nav>
    );
  }

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
            ? "bg-white shadow-md py-2"
            : "bg-white py-3"
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 sm:px-12 py-5 text-[var(--color-text-dark)]">
        {/* Logo + nombre */}
        <Link href="/">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Logo" className="w-10 h-10" />
            <span className="font-semibold text-lg tracking-wide">EnviGo</span>
          </div>
        </Link>

        {/* Links y botones - Desktop */}
        {!isAuthenticated ? (
          // Usuario NO autenticado - solo botón Login
          <button
            onClick={login}
            className="cursor-pointer px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg font-medium hover:bg-red-800 transition-colors duration-200"
          >
            Iniciar Sesión
          </button>
        ) : (
          // Usuario autenticado - Links + botón Logout
          <div className="hidden md:flex items-center gap-10 text-base font-medium">
            <Link
              href="/"
              className="hover:text-[var(--color-primary)] transform transition-transform duration-200 hover:scale-110"
            >
              Inicio
            </Link>
            <Link
              href="/calcular-costo"
              className="hover:text-[var(--color-primary)] transform transition-transform duration-200 hover:scale-110"
            >
              Calcular costo
            </Link>
            <Link
              href="/crear-envio"
              className="hover:text-[var(--color-primary)] transform transition-transform duration-200 hover:scale-110"
            >
              Crear envío
            </Link>
            <Link
              href="/consultar-envio"
              className="hover:text-[var(--color-primary)] transform transition-transform duration-200 hover:scale-110"
            >
              Consultar envío
            </Link>
            <button
              onClick={logout}
              className="cursor-pointer px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg font-medium hover:bg-red-800 transition-colors duration-200"
            >
              Cerrar Sesión
            </button>
          </div>
        )}

        {/* Botón hamburguesa (mobile) - solo cuando está autenticado */}
        {isAuthenticated && (
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-md text-[var(--color-text-dark)] hover:bg-gray-100 transition"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        )}
      </div>
      
      {/* Menú móvil - solo cuando está autenticado */}
      {isAuthenticated && menuOpen && (
        <div className="md:hidden bg-white shadow-md border-t border-gray-200 flex flex-col items-center space-y-4 py-6 text-lg font-medium text-[var(--color-text-dark)]">
          <Link href="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link href="/calcular-costo" onClick={() => setMenuOpen(false)}>Calcular costo</Link>
          <Link href="/crear-envio" onClick={() => setMenuOpen(false)}>Crear envío</Link>
          <Link href="/consultar-envio" onClick={() => setMenuOpen(false)}>Consultar envío</Link>
          <button
            onClick={() => {
              setMenuOpen(false);
              logout();
            }}
            className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors duration-200"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}

