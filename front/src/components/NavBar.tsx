"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
            ? "bg-white shadow-md"
            : "bg-white"
      }`}
    >
      <div className="w-full max-w-7xl mx-auto flex justify-between items-center px-12 py-6 text-[var(--color-text-dark)]">
        {/* Logo + nombre */}
        <Link href="/">
        <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Logo" className="w-10 h-10" />
            <span className="font-semibold text-lg tracking-wide">EnviGo</span>
          </div>
        </Link>

        {/* Links */}
        <div className="flex items-center justify-center gap-10 text-base font-medium">
          <Link
            href="/"
            className="hover:text-[var(--color-primary)] transform transition-transform duration-200 hover:scale-110"
          >
            Home
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
        </div>
      </div>
    </nav>
  );
}

