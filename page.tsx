import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative bg-blue-900 text-white py-24 sm:py-32 overflow-hidden">
        {/* Aquí puedes colocar una foto de un evento de UNAPA como fondo */}
        <div className="absolute inset-0 bg-[url('/images/evento-unapa-bg.jpg')] bg-cover bg-center opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
            Unión Nacional de Profesionales en <br className="hidden sm:block"/>
            <span className="text-amber-500">Administración, Inc.</span>
          </h1>
          <p className="max-w-2xl text-lg sm:text-xl text-slate-300 mb-6 font-semibold">
            "Por un administrador unido y competitivo"
          </p>
          <p className="max-w-2xl text-base sm:text-lg text-slate-300 mb-10">
            Agrupamos a los profesionales en Administración a nivel nacional para proteger sus derechos, fomentar la competitividad y alcanzar la excelencia integral.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/membresia" className="bg-amber-500 text-blue-950 px-8 py-3 rounded-md font-bold text-lg hover:bg-amber-400 transition shadow-lg">
              Afíliate a UNAPA
            </Link>
            <Link href="/contacto" className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-md font-bold text-lg hover:bg-white hover:text-blue-900 transition">
              Contáctanos
            </Link>
          </div>
        </div>
      </section>

      {/* Breve Resumen Institucional */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Representando la Excelencia Administrativa</h2>
            <p className="max-w-3xl mx-auto text-lg text-slate-600">
              Fundada en 2003, UNAPA es el gremio oficial que unifica y fortalece a los administradores dominicanos, siendo Miembro Pleno de la Organización Latinoamericana de Administración (OLA).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
            <div className="bg-white p-8 rounded-lg shadow-sm border border-slate-100">
              <div className="w-16 h-16 mx-auto bg-blue-100 text-blue-900 rounded-full flex items-center justify-center mb-4 text-2xl font-bold">🎓</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Desarrollo Académico</h3>
              <p className="text-slate-600">Acceso a becas de estudios, maestrías, doctorados y asesoría en tesis monográficas.</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm border border-slate-100">
              <div className="w-16 h-16 mx-auto bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-4 text-2xl font-bold">🌍</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Proyección Internacional</h3>
              <p className="text-slate-600">Participación en congresos en países miembros de OLA y certificación internacional.</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm border border-slate-100">
              <div className="w-16 h-16 mx-auto bg-blue-100 text-blue-900 rounded-full flex items-center justify-center mb-4 text-2xl font-bold">🤝</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Integración Gremial</h3>
              <p className="text-slate-600">Uso exclusivo del pin del Administrador Dominicano y reconocimientos al mérito profesional.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}