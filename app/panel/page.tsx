import { redirect } from 'next/navigation'
import { logout } from '@/app/login/actions'
import { createContent, deleteContent, updateContentStatus, updatePassword, updateProfile } from './actions'
import DocumentUploadForm from './DocumentUploadForm'
import { formatDateTime, getManagedContent } from '@/lib/content'
import { hasSupabaseEnv } from '@/lib/supabase/env'
import { createClient } from '@/lib/supabase/server'

type AuthorProfile = {
  id: string
  role: string
  full_name: string | null
  phone: string | null
  position: string | null
  bio: string | null
}

type ContentItem = {
  id: string
  title: string
  status: string
  author_id: string | null
  created_at: string
  published_at?: string | null
}

const errors: Record<string, string> = {
  invalid: 'Revisa los campos requeridos.',
  save: 'No se pudo guardar el contenido. Verifica tus permisos.',
  media: 'Debes subir un archivo o indicar un enlace válido.',
  profile: 'No se pudo actualizar el perfil.',
  password: 'La contraseña debe coincidir y tener al menos 8 caracteres.',
  delete: 'No se pudo eliminar el contenido.',
}

const tableLabels = {
  articles: 'Noticias y artículos',
  events: 'Eventos',
  photos: 'Fotos',
  videos: 'Videos',
  documents: 'PDFs',
}

export default async function PanelPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>
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
    .select('id, full_name, role, phone, position, bio')
    .eq('id', user.id)
    .single()
  const profile = profileData as AuthorProfile | null

  if (!profile || !['author', 'admin'].includes(profile.role)) {
    redirect('/login?error=invalid')
  }

  const isAdmin = profile.role === 'admin'
  const content = await getManagedContent(user.id, isAdmin)

  return (
    <div className="bg-slate-50 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 border-b border-slate-200 pb-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-amber-600">Panel privado</p>
            <h1 className="text-3xl font-extrabold text-blue-900">Contenido UNAPA</h1>
            <p className="mt-2 text-slate-600">
              Sesión activa: {profile.full_name ?? user.email} ({isAdmin ? 'administrador' : 'autor'})
            </p>
          </div>
          <form action={logout}>
            <button className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100">
              Cerrar sesión
            </button>
          </form>
        </div>

        <PanelMessages params={params} />

        <div className="grid gap-8 xl:grid-cols-[380px_minmax(0,1fr)]">
          <aside className="space-y-6">
            <ProfileForm profile={profile} />
            <PasswordForm />
          </aside>

          <main className="space-y-8">
            <DocumentUploadForm userId={user.id} />
            <CreateContentForm />
            <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900">
                  {isAdmin ? 'Administrar contenido' : 'Mi contenido'}
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  {isAdmin
                    ? 'Como administrador puedes publicar, despublicar y eliminar contenido de cualquier autor.'
                    : 'Puedes publicar, despublicar y eliminar los eventos, fotos, videos y PDFs que hayas subido.'}
                </p>
              </div>

              <div className="space-y-8">
                <ContentTable table="articles" items={content.articles} canDelete={false} />
                <ContentTable table="events" items={content.events} canDelete />
                <ContentTable table="photos" items={content.photos} canDelete />
                <ContentTable table="videos" items={content.videos} canDelete />
                <ContentTable table="documents" items={content.documents} canDelete />
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  )
}

function PanelMessages({ params }: { params: Record<string, string | undefined> }) {
  const success =
    params.saved || params.profile || params.password || params.updated || params.deleted
      ? 'Cambios guardados correctamente.'
      : null

  return (
    <>
      {success && (
        <div className="mb-6 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      )}
      {params.error && (
        <div className="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errors[params.error] ?? 'Ocurrió un error.'}
        </div>
      )}
    </>
  )
}

function ProfileForm({ profile }: { profile: AuthorProfile }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-900">Mi perfil</h2>
      <form action={updateProfile} className="mt-5 space-y-4">
        <TextField label="Nombre completo" name="full_name" defaultValue={profile.full_name ?? ''} />
        <TextField label="Teléfono" name="phone" defaultValue={profile.phone ?? ''} />
        <TextField label="Cargo / especialidad" name="position" defaultValue={profile.position ?? ''} />
        <label className="block text-sm font-medium text-slate-700">
          Biografía breve
          <textarea
            name="bio"
            rows={4}
            defaultValue={profile.bio ?? ''}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
          />
        </label>
        <button className="rounded-md bg-blue-900 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-800">
          Guardar perfil
        </button>
      </form>
    </section>
  )
}

function PasswordForm() {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-900">Contraseña</h2>
      <form action={updatePassword} className="mt-5 space-y-4">
        <TextField label="Nueva contraseña" name="password" type="password" />
        <TextField label="Confirmar contraseña" name="confirm_password" type="password" />
        <button className="rounded-md bg-slate-900 px-4 py-2 text-sm font-bold text-white transition hover:bg-slate-800">
          Cambiar contraseña
        </button>
      </form>
    </section>
  )
}

function CreateContentForm() {
  return (
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

        <TextField label="Título" name="title" required />
        <TextArea label="Resumen / descripción" name="description" rows={3} />
        <TextField label="Extracto para noticias" name="excerpt" />
        <TextArea label="Cuerpo / contenido" name="body" rows={7} />

        <div className="grid gap-4 md:grid-cols-2">
          <TextField label="Fecha del evento" name="starts_at" type="datetime-local" />
          <TextField label="Lugar del evento" name="location" />
        </div>

        <FileField label="Imagen de portada" name="cover" accept="image/*" />
        <FileField label="Archivo de foto/video" name="media" accept="image/*,video/*" />
        <TextField label="Enlace de video externo" name="video_url" type="url" />
        <TextField label="Texto alternativo para foto" name="alt_text" />

        <button className="rounded-md bg-blue-900 px-6 py-3 font-bold text-white shadow-md transition hover:bg-blue-800">
          Guardar contenido
        </button>
      </form>
    </section>
  )
}

function ContentTable({
  table,
  items,
  canDelete,
}: {
  table: 'articles' | 'events' | 'photos' | 'videos' | 'documents'
  items: ContentItem[]
  canDelete: boolean
}) {
  return (
    <section>
      <h3 className="mb-3 text-lg font-bold text-slate-900">{tableLabels[table]}</h3>
      {items.length === 0 ? (
        <p className="rounded-md border border-dashed border-slate-300 px-4 py-6 text-sm text-slate-500">
          Sin registros todavía.
        </p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 text-slate-700">
              <tr>
                <th className="px-4 py-3">Título</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-3 font-medium text-slate-900">{item.title}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                      {item.status === 'published' ? 'Publicado' : 'Borrador'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{formatDateTime(item.published_at ?? item.created_at)}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <form action={updateContentStatus}>
                        <input type="hidden" name="table" value={table} />
                        <input type="hidden" name="id" value={item.id} />
                        <input type="hidden" name="status" value={item.status === 'published' ? 'draft' : 'published'} />
                        <button className="rounded-md border border-blue-200 px-3 py-1 text-xs font-bold text-blue-900 transition hover:bg-blue-50">
                          {item.status === 'published' ? 'Despublicar' : 'Publicar'}
                        </button>
                      </form>
                      {canDelete && (
                        <form action={deleteContent}>
                          <input type="hidden" name="table" value={table} />
                          <input type="hidden" name="id" value={item.id} />
                          <button className="rounded-md border border-red-200 px-3 py-1 text-xs font-bold text-red-700 transition hover:bg-red-50">
                            Eliminar
                          </button>
                        </form>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

function TextField({
  label,
  name,
  type = 'text',
  defaultValue,
  required,
}: {
  label: string
  name: string
  type?: string
  defaultValue?: string
  required?: boolean
}) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      {label}
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
      />
    </label>
  )
}

function TextArea({ label, name, rows }: { label: string; name: string; rows: number }) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      {label}
      <textarea name={name} rows={rows} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" />
    </label>
  )
}

function FileField({ label, name, accept }: { label: string; name: string; accept: string }) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      {label}
      <input name={name} type="file" accept={accept} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" />
    </label>
  )
}
