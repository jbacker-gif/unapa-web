import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar' // Importamos el Navbar
import Footer from '@/components/Footer' // Importamos el Footer

export const metadata: Metadata = {
  title: 'UNAPA | Unión Nacional de Profesionales en Administración',
  description: 'Organización que agrupa a los profesionales en Administración a nivel nacional, promoviendo la excelencia, la ética y la competitividad.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="bg-slate-50 text-slate-900 flex flex-col min-h-screen">
        {/* El Navbar siempre arriba */}
        <Navbar />
        
        {/* El contenido de las páginas ocupará el espacio restante (flex-grow) */}
        <main className="flex-grow">
          {children}
        </main>
        
        {/* El Footer siempre al final */}
        <Footer />
      </body>
    </html>
  )
}
