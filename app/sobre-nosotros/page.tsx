export default function SobreNosotros() {
  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Encabezado */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-blue-900 mb-4">Sobre Nosotros</h1>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Conoce la historia, misión y los valores que impulsan a la Unión Nacional de Profesionales en Administración, Inc.
          </p>
        </div>

        {/* Sección: ¿Qué es UNAPA? */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-100 p-8 mb-12">
          <h2 className="text-2xl font-bold text-amber-600 mb-4">¿Qué es UNAPA?</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Es una organización que agrupa a todos los profesionales en Administración y sus diferentes especialidades a nivel nacional, de nacionalidad dominicana, sin importar en qué país resida, afiliación partidaria, religión que profese ni color. Fue fundada el 14 de noviembre del año 2003, e incorporada según el decreto 506 del 7 de junio de 2004.
          </p>
          <p className="text-slate-700 leading-relaxed">
            Esta institución fue creada para proporcionar a los profesionales en la administración una entidad sólida que los unifique, y proteja sus derechos e intereses.
          </p>
        </div>

        {/* Misión y Visión */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-blue-900 text-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-amber-500 mb-4">Nuestra Misión</h2>
            <p className="text-slate-200 leading-relaxed">
              Integrar y unificar al profesional en Administración y sus respectivas especialidades en interés de hacer que la sociedad empresarial privada y estatal reconozcan con verdadera justicia la importancia de este profesional como ente necesario para alcanzar la competitividad.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-slate-100 p-8">
            <h2 className="text-2xl font-bold text-blue-900 mb-4">Nuestra Visión</h2>
            <p className="text-slate-700 leading-relaxed">
              Procurar que el profesional de la Administración se convierta en un eficiente y eficaz gerente integral, capaz de manejar todas las facetas y circunstancias que intervienen en la acción empresarial en cualquier tipo de organización o institución interesada en ser competitiva en este nuevo milenio.
            </p>
          </div>
        </div>

        {/* Valores */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-100 p-8">
          <h2 className="text-2xl font-bold text-blue-900 mb-6 text-center">Nuestros Principios y Valores</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-center">
            {[
              "Valor ético", "Profesionalidad", "Honestidad y lealtad", "Gremialidad", 
              "Nacionalismo", "Competitividad", "Compromiso", "Trabajo en equipo", 
              "Sociabilidad y humanismo", "Autenticidad y crítica", "Adaptabilidad e innovación"
            ].map((valor, index) => (
              <div key={index} className="bg-slate-50 p-4 rounded-md border border-slate-200 text-slate-800 font-medium">
                {valor}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}