export default function Contacto() {
  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Encabezado */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-blue-900 mb-4">Contáctanos</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            ¿Tienes alguna pregunta sobre nuestra organización o deseas iniciar tu proceso de afiliación? Escríbenos y te responderemos a la brevedad.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Información de Contacto */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-100 p-8 h-fit">
            <h2 className="text-2xl font-bold text-blue-900 mb-6">Información Institucional</h2>
            
            <div className="space-y-8 text-slate-700">
              <div className="flex items-start">
                <span className="text-amber-500 text-2xl mr-4">📍</span>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Dirección</h3>
                  <p>Santo Domingo, Distrito Nacional, República Dominicana.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <span className="text-amber-500 text-2xl mr-4">✉️</span>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Correos Electrónicos</h3>
                  <p>unapain@hotmail.com</p>
                  <p>patriaf@hotmail.com</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <span className="text-amber-500 text-2xl mr-4">📱</span>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Redes Sociales</h3>
                  <p><strong>Búscanos como:</strong> UnapaRd</p>
                  <p><strong>Instagram / X:</strong> @administrandoconpatria</p>
                </div>
              </div>
            </div>
          </div>

          {/* Formulario de Contacto */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-100 p-8">
            <h2 className="text-2xl font-bold text-blue-900 mb-6">Envíanos un Mensaje</h2>
            
            {/* Nota para desarrollo: En la Fase 1 puedes conectar este formulario a Formspree agregando action="https://formspree.io/f/tu-codigo" */}
            <form className="space-y-5">
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-slate-700 mb-1">Nombre Completo</label>
                <input type="text" id="nombre" className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-blue-900 focus:border-blue-900 outline-none transition" placeholder="Ingresa tu nombre" required />
              </div>
              
              <div>
                <label htmlFor="correo" className="block text-sm font-medium text-slate-700 mb-1">Correo Electrónico</label>
                <input type="email" id="correo" className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-blue-900 focus:border-blue-900 outline-none transition" placeholder="tu@correo.com" required />
              </div>

              <div>
                <label htmlFor="asunto" className="block text-sm font-medium text-slate-700 mb-1">Asunto</label>
                <select id="asunto" className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-blue-900 focus:border-blue-900 outline-none bg-white transition">
                  <option>Información General</option>
                  <option>Proceso de Afiliación</option>
                  <option>Eventos y Capacitaciones</option>
                  <option>Otro</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="mensaje" className="block text-sm font-medium text-slate-700 mb-1">Mensaje</label>
                <textarea id="mensaje" rows={4} className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-blue-900 focus:border-blue-900 outline-none resize-none transition" placeholder="¿En qué podemos ayudarte?" required></textarea>
              </div>
              
              <button type="submit" className="w-full bg-blue-900 text-white font-bold py-3 px-4 rounded-md hover:bg-blue-800 transition shadow-md">
                Enviar Mensaje
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  )
}