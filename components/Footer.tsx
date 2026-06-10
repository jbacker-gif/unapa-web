import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-800 bg-slate-900 py-12 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-4 text-xl font-bold text-white">
              UNAPA<span className="text-amber-500">.</span>
            </h3>
            <p className="mb-4 pr-4 text-sm text-slate-400">
              Unión Nacional de Profesionales en Administración, Inc.
              <br />
              Por un administrador unido y competitivo.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-bold text-white">Enlaces Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="transition hover:text-amber-500">Inicio</Link></li>
              <li><Link href="/sobre-nosotros" className="transition hover:text-amber-500">Sobre Nosotros</Link></li>
              <li><Link href="/noticias" className="transition hover:text-amber-500">Noticias</Link></li>
              <li><Link href="/eventos" className="transition hover:text-amber-500">Eventos</Link></li>
              <li><Link href="/galeria" className="transition hover:text-amber-500">Galería</Link></li>
              <li><Link href="/membresia" className="transition hover:text-amber-500">Membresía</Link></li>
              <li><Link href="/contacto" className="transition hover:text-amber-500">Contacto</Link></li>
              <li><Link href="/login" className="transition hover:text-amber-500">Autores</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-bold text-white">Contacto</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>Santo Domingo, República Dominicana</li>
              <li>unapain@hotmail.com</li>
              <li>patriaf@hotmail.com</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-800 pt-8 text-center text-sm text-slate-500">
          <p>&copy; {currentYear} UNAPA. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
