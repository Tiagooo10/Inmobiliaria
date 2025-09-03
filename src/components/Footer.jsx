export default function Footer({ currentUser })  {

   if (!currentUser) return null;
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        {/* Sección superior */}
        <div className="xl:flex xl:items-center xl:justify-between">
          <div className="flex justify-center space-x-6 xl:justify-start">
            <a href="#" className="text-gray-400 hover:text-white">
              <span className="sr-only">Facebook</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.99 3.66 9.12 8.44 9.88v-6.99h-2.54v-2.89h2.54V9.41c0-2.51 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.89h-2.34v6.99C18.34 21.12 22 16.99 22 12z" />
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <span className="sr-only">Twitter</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 19c7.5 0 11.6-6.2 11.6-11.6v-.53A8.3 8.3 0 0022 4.4a8.2 8.2 0 01-2.36.65 4.1 4.1 0 001.8-2.27 8.17 8.17 0 01-2.6.99 4.08 4.08 0 00-6.94 3.72A11.58 11.58 0 013 4.9a4.08 4.08 0 001.27 5.44 4.07 4.07 0 01-1.85-.51v.05a4.08 4.08 0 003.27 4 4.08 4.08 0 01-1.84.07 4.08 4.08 0 003.81 2.83A8.2 8.2 0 012 17.54a11.57 11.57 0 006.29 1.84" />
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <span className="sr-only">GitHub</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.49.5.09.66-.22.66-.49v-1.7c-2.78.61-3.37-1.34-3.37-1.34-.45-1.16-1.1-1.47-1.1-1.47-.9-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.88 1.51 2.31 1.07 2.88.82.09-.64.35-1.07.63-1.31-2.22-.25-4.55-1.11-4.55-4.93 0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02A9.56 9.56 0 0112 6.8a9.54 9.54 0 012.5.34c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.6 1.03 2.69 0 3.82-2.34 4.68-4.57 4.92.36.31.68.91.68 1.83v2.71c0 .27.16.58.68.49A10 10 0 0022 12c0-5.52-4.48-10-10-10z" clipRule="evenodd"/>
              </svg>
            </a>
          </div>

          <p className="mt-8 text-center text-sm leading-6 text-gray-400 xl:mt-0">
            &copy; 2025 Tu Empresa. Todos los derechos reservados.
          </p>
        </div>

        {/* Sección enlaces */}
        <div className="mt-10 grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div>
            <h3 className="text-sm font-semibold leading-6 text-white">Compañía</h3>
            <ul className="mt-4 space-y-4">
              <li><a href="#" className="hover:text-white">Acerca de</a></li>
              <li><a href="#" className="hover:text-white">Carreras</a></li>
              <li><a href="#" className="hover:text-white">Blog</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold leading-6 text-white">Productos</h3>
            <ul className="mt-4 space-y-4">
              <li><a href="#" className="hover:text-white">Alquileres</a></li>
              <li><a href="#" className="hover:text-white">Ventas</a></li>
              <li><a href="#" className="hover:text-white">Servicios</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold leading-6 text-white">Soporte</h3>
            <ul className="mt-4 space-y-4">
              <li><a href="#" className="hover:text-white">Contacto</a></li>
              <li><a href="#" className="hover:text-white">Ayuda</a></li>
              <li><a href="#" className="hover:text-white">FAQs</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold leading-6 text-white">Legal</h3>
            <ul className="mt-4 space-y-4">
              <li><a href="#" className="hover:text-white">Privacidad</a></li>
              <li><a href="#" className="hover:text-white">Términos</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
