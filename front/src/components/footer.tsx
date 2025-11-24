import Link from 'next/link';

// Iconos para la sección de Contacto (manteniendo los existentes)
const MailIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);

const PhoneIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.717 21 3 14.283 3 6V5z"
    />
  </svg>
);

const MapPinIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"
    />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const EnviGoIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
    />
  </svg>
);


const Footer = () => {
  const currentYear = new Date().getFullYear();
  const companyName = "EnviGo";

  // Estructura y datos actualizados (Dirección simplificada y Corrientes Capital reemplazado)
  const navItems = {
    quickLinks: [
      { name: 'Inicio', href: '/' },
      { name: 'Calcular Costo', href: '/calcular-costo' },
      { name: 'Crear Envío', href: '/crear-envio' },
      { name: 'Consultar Envío', href: '/consultar-envio' },
    ],
    schedule: [ 
      { day: 'Lunes a Viernes', hours: '10:00 - 19:00' },
      { day: 'Sábados', hours: '10:00 - 14:00' },
    ],
    contact: {
      email: 'info@envigo.com',
      whatsapp: '+54 11 4567-8900',
      // Dirección simplificada para evitar desbordamiento:
      address: [
        'Arazá 352',
        'Ciudad de Resistencia, Chaco',
        'Argentina',
      ],
    },
  };

  return (
    <footer
      className="bg-[var(--color-primary)] text-[var(--color-text-light)] pt-12"
      aria-labelledby="footer-heading"
    >
      <h2 id="footer-heading" className="sr-only">
        {companyName} Footer
      </h2>
      {/* Relleno lateral reducido de px-6 a px-4 en móviles, para dar más espacio */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> 
        {/* Usamos gap-4 para reducir la separación entre columnas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 xl:col-span-4">
          
          {/* Columna 1: Logo y Slogan - Se asegura que ocupe todo su espacio en la rejilla */}
          <div className="space-y-4 col-span-2 md:col-span-1 w-full">
            <div className="flex items-center space-x-2">
              <img
                src="/logo.png"
                alt="EnviGo Logo"
                className="h-10 w-10 object-contain"
              />

              <span className="text-2xl font-bold font-[var(--font-heading)]">
                {companyName}
              </span>
            </div>
            <p className="text-base text-[var(--color-light)]">
              Tu socio confiable en soluciones logísticas y envíos a nivel nacional.
            </p>
          </div>

          {/* Columna 2: Enlaces Rápidos */}
          <div className="ml-12">
            <h3 className="text-lg font-semibold text-[var(--color-secondary)] mb-4 font-[var(--font-heading)]">
              Enlaces Rápidos
            </h3>
            <ul role="list" className="space-y-3">
              {navItems.quickLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-base text-[var(--color-text-light)] hover:text-[var(--color-secondary)] transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 3: Sobre Nosotros (Horarios Laborales) */}
          <div>
            <h3 className="text-lg font-semibold text-[var(--color-secondary)] mb-4 font-[var(--font-heading)]">
              Sobre Nosotros
            </h3>
            <p className="text-base font-semibold mb-2">Horarios Laborales:</p>
            <ul role="list" className="space-y-1">
              {navItems.schedule.map((item) => (
                <li key={item.day} className="text-base text-[var(--color-text-light)]">
                  <span className="font-normal">{item.day}:</span> {item.hours}
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 4: Contacto - w-full para evitar desbordamiento */}
          <div className="w-full">
            <h3 className="text-lg font-semibold text-[var(--color-secondary)] mb-4 font-[var(--font-heading)]">
              Contacto
            </h3>
            <ul role="list" className="space-y-3">
              {/* Email */}
              <li className="flex items-start">
                <MailIcon className="flex-shrink-0 h-6 w-6 mr-3 text-[var(--color-secondary)]" />
                <a
                  href={`mailto:${navItems.contact.email}`}
                  // break-all para forzar que el email largo se parta si es necesario
                  className="text-base text-[var(--color-text-light)] hover:text-[var(--color-secondary)] transition-colors duration-200 break-all" 
                >
                  {navItems.contact.email}
                </a>
              </li>
              {/* WhatsApp/Teléfono */}
              <li className="flex items-start">
                <PhoneIcon className="flex-shrink-0 h-6 w-6 mr-3 text-[var(--color-secondary)]" />
                <a
                  href={`tel:${navItems.contact.whatsapp.replace(/[^0-9+]/g, '')}`}
                  className="text-base text-[var(--color-text-light)] hover:text-[var(--color-secondary)] transition-colors duration-200"
                >
                  {navItems.contact.whatsapp}
                </a>
              </li>
              {/* Dirección Multilínea */}
              <li className="flex items-start">
                <MapPinIcon className="flex-shrink-0 h-6 w-6 mr-3 text-[var(--color-secondary)] mt-1" />
                {/* w-full y break-words para asegurar que el texto se ajuste dentro del contenedor */}
                <address className="not-italic text-base text-[var(--color-text-light)] space-y-0.5 w-full break-words">
                  {navItems.contact.address.map((line, index) => (
                    <span key={index} className="block leading-tight">
                      {line}
                    </span>
                  ))}
                </address>
              </li>
            </ul>
          </div>
        </div>

        {/* Separador */}
        <div className="mt-12 border-t border-[var(--color-card-border-dark)] pt-8 pb-10">
          <p className="text-center text-sm text-[var(--color-light)]">
            &copy; {currentYear} {companyName}. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
