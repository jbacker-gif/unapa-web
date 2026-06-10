import { redirect } from 'next/navigation'
import { logout } from '@/app/login/actions'
import { createContent } from './actions'
import { getAuthorContent } from '@/lib/content'
import { hasSupabaseEnv } from '@/lib/supabase/env'
import { createClient } from '@/lib/supabase/server'

type AuthorProfile = { id: string; role: string; full_name: string | null }

const errors: Record<string, string> = {
  invalid: 'Revisa los campos requeridos.',
  save: 'No se pudo guardar el contenido. Verifica tus permisos.',
  media: 'Debes subir un archivo o indicar un enlace válido.',
}

export default async function PanelPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; saved?: string }>
}) {
  if (!hasSupabaseEnv()) redirect('/login?error=config')

  const params = await searchParams
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profileData } = await supabase
    .from('profiles')
    .select('id, full_name, role')
    .eq('id', user.id)
    .single()
  const profile = profileData as AuthorProfile | null

  if (!profile || !['author', 'admin'].includes(profile.role)) {
    redirect('/login?error=invalid')
  }

  const content = await getAuthorContent(user.id)

  return (
    <div className="bg-slate-50 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 border-b border-slate-200 pb-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-amber-600">Panel privado</p>
            <h1 className="text-3xl font-extrabold text-blue-900">Contenido UNAPA</h1>
            <p className="mt-2 text-slate-600">
              Sesión activa: {profile.full_name ?? user.email} ({profile.role})
            </p>
          </div>
          <form action={logout}>
            <button className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100">
              Cerrar sesión
            </button>
          </form>
        </div>

        {params.saved && (
          <div className="mb-6 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            Contenido guardado correctamente.
          </div>
        )}
        {params.error && (
          <div className="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errors[params.error] ?? 'Ocurrió un error.'}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
          <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">Crear contenido</h2>
            <p className="mt-2 text-sm text-slate-600">
              Los borradores quedan ocultos al público. Publicado aparece inmediatamente en la web.
            </p>

            <form action={createContent} className="mt-6 space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block text-sm font-medium text-slate-700">
                  Tipo
                  <select name="type" className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2">
                    <option value="article">Noticia / artículo</option>
                    <option value="event">Evento</option>
                    <option value="photo">Foto</option>
                    <option value="video">Video</option>
                  </select>
                </label>
                <label className="block text-sm font-medium text-slate-700">
                  Estado
                  <select name="status" className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2">
                    <option value="draft">Borrador</option>
                    <option value="published">Publicado</option>
                  </select>
                </label>
              </div>

              <label className="block text-sm font-medium text-slate-700">
                Título
                <input name="title" required className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" />
              </label>

              <label className="block text-sm font-medium text-slate-700">
                Resumen / descripción
                <textarea name="description" rows={3} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" />
              </label>

              <label className="block text-sm font-medium text-slate-700">
                Extracto para noticias
                <input name="excerpt" className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" />
              </label>

              <label className="block text-sm font-medium text-slate-700">
                Cuerpo / contenido
                <textarea name="body" rows={7} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" />
              </label>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="block text-sm font-medium text-slate-700">
                  Fecha del evento
                  <input name="starts_at" type="datetime-local" className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" />
                </label>
                <label className="block text-sm font-medium text-slate-700">
                  Lugar del evento
                  <input name="location" className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" />
                </label>
              </div>

              <label className="block text-sm font-medium text-slate-700">
                Imagen de portada
                <input name="cover" type="file" accept="image/*" className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" />
              </label>

              <label className="block text-sm font-medium text-slate-700">
                Archivo de foto/video
                <input name="media" type="file" accept="image/*,video/*" className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" />
              </label>

              <label className="block text-sm font-medium text-slate-700">
                Enlace de video externo
                <input name="video_url" type="url" className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" />
              </label>

              <label className="block text-sm font-medium text-slate-700">
                Texto alternativo para foto
                <input name="alt_text" className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" />
              </label>

              <button className="rounded-md bg-blue-900 px-6 py-3 font-bold text-white shadow-md transition hover:bg-blue-800">
                Guardar contenido
              </button>
            </form>
          </section>

          <aside className="space-y-5">
            <ContentList title="Noticias recientes" items={content.articles.map((item) => `${item.title} - ${item.status}`)} />
            <ContentList title="Eventos recientes" items={content.events.map((item) => `${item.title} - ${item.status}`)} />
            <ContentList title="Fotos recientes" items={content.photos.map((item) => `${item.title} - ${item.status}`)} />
            <ContentList title="Videos recientes" items={content.videos.map((item) => `${item.title} - ${item.status}`)} />
          </aside>
        </div>
      </div>
    </div>
  )
}

function ContentList({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="font-bold text-slate-900">{title}</h2>
      {items.length === 0 ? (
        <p className="mt-3 text-sm text-slate-500">Sin registros todavía.</p>
      ) : (
        <ul className="mt-3 space-y-2 text-sm text-slate-600">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
    </section>
  )
}
