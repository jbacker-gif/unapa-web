import Link from 'next/link';

export default function Membresia() {
  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Encabezado */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-blue-900 mb-4">Membresía UNAPA</h1>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Únete a la organización que agrupa y protege a los profesionales en administración. Descubre las ventajas de ser parte de una entidad sólida y competitiva.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Sección: Beneficios */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-100 p-8">
            <h2 className="text-2xl font-bold text-amber-600 mb-6 flex items-center">
              <span className="text-3xl mr-3">🌟</span> Beneficios para Afiliados
            </h2>
            <ul className="space-y-4 text-slate-700">
              <li className="flex items-start">
                <span className="text-blue-900 font-bold mr-2">✓</span> Becas de estudios nacionales e internacionales.
              </li>
              <li className="flex items-start">
                <span className="text-blue-900 font-bold mr-2">✓</span> Participación en maestrías y doctorados.
              </li>
              <li className="flex items-start">
                <span className="text-blue-900 font-bold mr-2">✓</span> Facilidad para la publicación de libros y artículos.
              </li>
              <li className="flex items-start">
                <span className="text-blue-900 font-bold mr-2">✓</span> Asesoría de tesis y monográficos.
              </li>
              <li className="flex items-start">
                <span className="text-blue-900 font-bold mr-2">✓</span> Certificación Internacional por la Organización Latinoamericana de Administración (OLA).
              </li>
              <li className="flex items-start">
                <span className="text-blue-900 font-bold mr-2">✓</span> Participación y asistencia a congresos y seminarios en países miembros de OLA.
              </li>
              <li className="flex items-start">
                <span className="text-blue-900 font-bold mr-2">✓</span> Reconocimientos al mérito profesional.
              </li>
              <li className="flex items-start">
                <span className="text-blue-900 font-bold mr-2">✓</span> Uso del pin del &quot;Administrador Dominicano&quot;.
              </li>
            </ul>
          </div>

          {/* Sección: Requisitos */}
          <div className="bg-blue-900 text-white rounded-lg shadow-sm p-8 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-bold text-amber-500 mb-6 flex items-center">
                <span className="text-3xl mr-3">📋</span> Requisitos de Inscripción
              </h2>
              <p className="text-slate-300 mb-6">
                Para formar parte de UNAPA, los profesionales deben cumplir con los siguientes requisitos básicos:
              </p>
              <ul className="space-y-4 text-slate-100 mb-8">
                <li className="flex items-center bg-blue-800 p-3 rounded-md">
                  <span className="font-bold text-amber-400 mr-3">1.</span> Llenar formulario de solicitud de afiliado.
                </li>
                <li className="flex items-center bg-blue-800 p-3 rounded-md">
                  <span className="font-bold text-amber-400 mr-3">2.</span> Copia de Currículum Vitae.
                </li>
                <li className="flex items-center bg-blue-800 p-3 rounded-md">
                  <span className="font-bold text-amber-400 mr-3">3.</span> Una (1) foto 2x2.
                </li>
                <li className="flex items-center bg-blue-800 p-3 rounded-md">
                  <span className="font-bold text-amber-400 mr-3">4.</span> Papel de Buena Conducta.
                </li>
              </ul>
            </div>
            
            {/* Llamado a la acción */}
            <div className="mt-auto">
              <div className="bg-amber-500 text-blue-950 p-4 rounded-md text-center mb-4 font-bold">
                ¡Inscripciones Abiertas!
              </div>
              <Link href="/contacto" className="block w-full text-center bg-white text-blue-900 font-bold py-3 rounded-md hover:bg-slate-100 transition shadow-md">
                Solicitar Formulario de Afiliación
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
