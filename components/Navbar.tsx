"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const links = [
  { href: '/sobre-nosotros', label: 'Sobre Nosotros' },
  { href: '/noticias', label: 'Noticias' },
  { href: '/eventos', label: 'Eventos' },
  { href: '/galeria', label: 'Galería' },
  { href: '/membresia', label: 'Membresía' },
  { href: '/contacto', label: 'Contacto' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex flex-shrink-0 items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/Logo.jpg"
                alt="Logo UNAPA"
                width={180}
                height={60}
                className="h-14 w-auto object-contain"
                priority
              />
            </Link>
          </div>

          <div className="hidden items-center gap-5 md:flex lg:gap-7">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-slate-600 transition hover:text-blue-900 lg:text-base"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/membresia"
              className="rounded-md bg-blue-900 px-5 py-2 font-medium text-white shadow-md transition hover:bg-blue-800"
            >
              Afíliate
            </Link>
            <Link href="/login" className="text-sm font-semibold text-amber-600 transition hover:text-amber-700">
              Autores
            </Link>
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 hover:text-blue-900 focus:outline-none"
              aria-label="Abrir menú"
              type="button"
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

      {isOpen && (
        <div className="absolute w-full space-y-1 border-t border-slate-100 bg-white px-2 pb-3 pt-2 shadow-lg sm:px-3 md:hidden">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block rounded-md px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-900"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/login"
            onClick={() => setIsOpen(false)}
            className="block rounded-md px-3 py-2 text-base font-semibold text-amber-600 hover:bg-slate-50"
          >
            Autores
          </Link>
          <Link
            href="/membresia"
            onClick={() => setIsOpen(false)}
            className="mt-4 block rounded-md bg-amber-500 px-3 py-3 text-center text-base font-bold text-blue-950 shadow-sm"
          >
            Afíliate Hoy
          </Link>
        </div>
      )}
    </nav>
  );
}
