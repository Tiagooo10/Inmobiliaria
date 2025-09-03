import { useState } from "react";
export const DIRECTUS_URL = "https://directus-1-6hgt.onrender.com";

export const Header = ({ isLoggedIn, currentUser, colorPrincipal = "#4f46e5", colorSecundario = "#818cf8" }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  if (!isLoggedIn) return null;

  // URL del logo, si existe; si no, usar uno por defecto
  const logoUrl = currentUser?.logoInmobiliaria
  ? `${DIRECTUS_URL}/assets/${currentUser.logoInmobiliaria}`
  : "https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500";


  return (
    <header style={{ backgroundColor: colorPrincipal }} className="fixed inset-x-0 top-0 z-50">
      <nav className="flex items-center justify-between p-4 lg:px-8" aria-label="Global">
        {/* Logo */}
        <div className="flex lg:flex-1">
          <a href="/" className="-m-1.5 p-1.5 flex items-center gap-2">
            <img
              src={logoUrl}
              alt="Logo Inmobiliaria"
              className="h-12 w-12 rounded-md"
            />
            <span className="text-white font-bold">{currentUser?.nombreInmobiliaria || "Inmobiliaria App"}</span>
          </a>
        </div>

        {/* Botón menú (mobile) */}
        <div className="flex lg:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2.5 text-white rounded-md"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
              )}
            </svg>
          </button>
        </div>

        {/* Menú escritorio */}
        {isLoggedIn && (
          <div className="hidden lg:flex lg:gap-x-12">
            <a href="/inicio" className="text-sm font-semibold text-white hover:text-gray-200">Inicio</a>
            <a href="/contrato" className="text-sm font-semibold text-white hover:text-gray-200">Ingresar</a>
            <a href="/buscar" className="text-sm font-semibold text-white hover:text-gray-200">Ver contratos</a>
            <a href="/perfil" className="text-sm font-semibold text-white hover:text-gray-200">👤 {currentUser?.email}</a>
          </div>
        )}

        {/* Menú mobile */}
        {menuOpen && (
          <div className="lg:hidden px-6 pb-6" style={{ backgroundColor: colorPrincipal }}>
            {isLoggedIn && (
              <>
                <a href="/inicio" className="block py-2 text-base font-semibold text-white hover:text-gray-200">Inicio</a>
                <a href="/contrato" className="block py-2 text-base font-semibold text-white hover:text-gray-200">Ingresar</a>
                <a href="/buscar" className="block py-2 text-base font-semibold text-white hover:text-gray-200">Ver contratos</a>
                <a href="/perfil" className="block py-2 text-base font-semibold text-white hover:text-gray-200">👤 {currentUser?.email}</a>
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};





