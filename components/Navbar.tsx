"use client";
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          {/* Logo Plano (Sin texto adicional ni círculos) */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center">
              {/* 
                Ajustamos el tamaño para que encaje perfectamente en el Navbar. 
                'object-contain' asegura que el logo no se deforme ni se recorte.
              */}
              <Image 
                src="/images/Logo.jpg" 
                alt="Logo UNAPA" 
                width={180} 
                height={60} 
                className="object-contain h-14 w-auto"
                priority
              />
            </Link>
          </div>
          
          {/* Enlaces de escritorio */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link href="/sobre-nosotros" className="text-slate-600 hover:text-blue-900 font-medium transition">Sobre Nosotros</Link>
            <Link href="/membresia" className="text-slate-600 hover:text-blue-900 font-medium transition">Membresía</Link>
            <Link href="/contacto" className="text-slate-600 hover:text-blue-900 font-medium transition">Contacto</Link>
            
            {/* Botón CTA Escritorio */}
            <Link href="/membresia" className="bg-blue-900 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-800 transition shadow-md">
              Afíliate
            </Link>
          </div>

          {/* Botón menú móvil */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="text-slate-600 hover:text-blue-900 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Menú móvil desplegable */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-2 pt-2 pb-3 space-y-1 sm:px-3 shadow-lg absolute w-full">
          <Link href="/sobre-nosotros" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-blue-900 hover:bg-slate-50">Sobre Nosotros</Link>
          <Link href="/membresia" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-blue-900 hover:bg-slate-50">Membresía</Link>
          <Link href="/contacto" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-blue-900 hover:bg-slate-50">Contacto</Link>
          <Link href="/membresia" onClick={() => setIsOpen(false)} className="block mt-4 text-center bg-amber-500 text-blue-950 px-3 py-3 rounded-md text-base font-bold shadow-sm">Afíliate Hoy</Link>
        </div>
      )}
    </nav>
  );
}