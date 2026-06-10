import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Columna 1: Marca */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">
              UNAPA<span className="text-amber-500">.</span>
            </h3>
            <p className="text-sm text-slate-400 mb-4 pr-4">
              Unión Nacional de Profesionales en Administración, Inc.
              <br />
              Por un administrador unido y competitivo.
            </p>
          </div>

          {/* Columna 2: Enlaces Rápidos */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-amber-500 transition">Inicio</Link></li>
              <li><Link href="/sobre-nosotros" className="hover:text-amber-500 transition">Sobre Nosotros</Link></li>
              <li><Link href="/membresia" className="hover:text-amber-500 transition">Membresía</Link></li>
              <li><Link href="/contacto" className="hover:text-amber-500 transition">Contacto</Link></li>
            </ul>
          </div>

          {/* Columna 3: Contacto Breve */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Contacto</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>Santo Domingo, República Dominicana</li>
              <li>unapain@hotmail.com</li>
              <li>patriaf@hotmail.com</li>
            </ul>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
          <p>&copy; {currentYear} UNAPA. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
