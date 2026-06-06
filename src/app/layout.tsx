import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Organización de Profesionales en Administración | Liderazgo y Excelencia',
  description: 'Conectamos y fortalecemos a los profesionales, estudiantes y especialistas del área administrativa mediante capacitación, networking y ética profesional.',
  keywords: 'administración, profesionales, liderazgo, gestión, networking, asociación profesional',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-slate-50 text-slate-900`}>
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        {/* Aquí iría el componente <Footer /> */}
      </body>
    </html>
  )
}
