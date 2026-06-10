import { login } from './actions'

const errors: Record<string, string> = {
  config: 'Faltan las variables de Supabase en el despliegue.',
  missing: 'Completa correo y contraseña.',
  invalid: 'Credenciales inválidas o usuario no autorizado.',
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams
  const message = params.error ? errors[params.error] : null

  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="mx-auto max-w-md px-4">
        <div className="rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-blue-900">Acceso de autores</h1>
          <p className="mt-3 text-sm text-slate-600">
            Ingresa con una cuenta autorizada por UNAPA para administrar noticias, eventos y multimedia.
          </p>

          {message && (
            <div className="mt-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {message}
            </div>
          )}

          <form action={login} className="mt-8 space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 w-full rounded-md border border-slate-300 px-4 py-2 outline-none transition focus:border-blue-900 focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="mt-1 w-full rounded-md border border-slate-300 px-4 py-2 outline-none transition focus:border-blue-900 focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-md bg-blue-900 px-4 py-3 font-bold text-white shadow-md transition hover:bg-blue-800"
            >
              Entrar al panel
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
