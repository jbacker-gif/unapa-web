import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { updateArticleContent, updateEventContent } from '@/app/panel/actions'
import { hasSupabaseEnv } from '@/lib/supabase/env'
import { createClient } from '@/lib/supabase/server'
import type { Article, Event } from '@/lib/content'

type EditTable = 'articles' | 'events'

type AuthorProfile = {
  id: string
  role: string
}

function formatDateTimeLocal(value: string) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    day: '2-digit',
    hour: '2-digit',
    hour12: false,
    minute: '2-digit',
    month: '2-digit',
    timeZone: 'America/Santo_Domingo',
    year: 'numeric',
  }).formatToParts(new Date(value))

  const byType = Object.fromEntries(parts.map((part) => [part.type, part.value]))
  return `${byType.year}-${byType.month}-${byType.day}T${byType.hour}:${byType.minute}`
}

async function requirePanelAccess() {
  if (!hasSupabaseEnv()) redirect('/login?error=config')

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profileData } = await supabase
    .from('profiles')
    .select('id, role')
    .eq('id', user.id)
    .single()
  const profile = profileData as AuthorProfile | null

  if (!profile || !['author', 'admin'].includes(profile.role)) {
    redirect('/login?error=invalid')
  }

  return { supabase }
}

export default async function EditContentPage({
  params,
}: {
  params: Promise<{ table: string; id: string }>
}) {
  const { table, id } = await params

  if (table !== 'articles' && table !== 'events') notFound()

  const { supabase } = await requirePanelAccess()
  const { data } = await supabase.from(table as EditTable).select('*').eq('id', id).maybeSingle()

  if (!data) notFound()

  return (
    <div className="bg-slate-50 py-10">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Link href="/panel" className="text-sm font-bold text-blue-900 transition hover:text-blue-700">
          Volver al panel
        </Link>
        {table === 'articles' ? (
          <ArticleEditForm article={data as Article} />
        ) : (
          <EventEditForm event={data as Event} />
        )}
      </div>
    </div>
  )
}

function ArticleEditForm({ article }: { article: Article }) {
  return (
    <section className="mt-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold text-slate-900">Editar noticia / artículo</h1>
      <form action={updateArticleContent} className="mt-6 space-y-5">
        <input type="hidden" name="id" value={article.id} />
        <div className="grid gap-4 md:grid-cols-2">
          <TextField label="Título" name="title" defaultValue={article.title} required />
          <StatusField defaultValue={article.status} />
        </div>
        <TextField label="Extracto para noticias" name="excerpt" defaultValue={article.excerpt ?? ''} />
        <TextArea label="Cuerpo / contenido" name="body" rows={10} defaultValue={article.body} required />
        <ExistingFile label="Portada actual" href={article.cover_image_url} />
        <FileField label="Nueva imagen de portada" name="cover" accept="image/*" />
        <ExistingFile label="PDF anexo actual" href={article.attachment_pdf_url} text={article.attachment_pdf_file_name} />
        <FileField label="Nuevo documento PDF anexo" name="attachment_pdf" accept="application/pdf,.pdf" />
        <button className="rounded-md bg-blue-900 px-6 py-3 font-bold text-white shadow-md transition hover:bg-blue-800">
          Guardar cambios
        </button>
      </form>
    </section>
  )
}

function EventEditForm({ event }: { event: Event }) {
  return (
    <section className="mt-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold text-slate-900">Editar evento</h1>
      <form action={updateEventContent} className="mt-6 space-y-5">
        <input type="hidden" name="id" value={event.id} />
        <div className="grid gap-4 md:grid-cols-2">
          <TextField label="Título" name="title" defaultValue={event.title} required />
          <StatusField defaultValue={event.status} />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <TextField label="Fecha del evento" name="starts_at" type="datetime-local" defaultValue={formatDateTimeLocal(event.starts_at)} />
          <TextField label="Lugar del evento" name="location" defaultValue={event.location ?? ''} />
        </div>
        <TextArea label="Resumen / descripción" name="description" rows={3} defaultValue={event.description ?? ''} />
        <TextArea label="Cuerpo / contenido" name="body" rows={10} defaultValue={event.body ?? ''} />
        <ExistingFile label="Portada actual" href={event.cover_image_url} />
        <FileField label="Nueva imagen de portada" name="cover" accept="image/*" />
        <ExistingFile label="PDF anexo actual" href={event.attachment_pdf_url} text={event.attachment_pdf_file_name} />
        <FileField label="Nuevo documento PDF anexo" name="attachment_pdf" accept="application/pdf,.pdf" />
        <button className="rounded-md bg-blue-900 px-6 py-3 font-bold text-white shadow-md transition hover:bg-blue-800">
          Guardar cambios
        </button>
      </form>
    </section>
  )
}

function StatusField({ defaultValue }: { defaultValue: string }) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      Estado
      <select name="status" defaultValue={defaultValue} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2">
        <option value="draft">Borrador</option>
        <option value="published">Publicado</option>
      </select>
    </label>
  )
}

function ExistingFile({ label, href, text }: { label: string; href?: string | null; text?: string | null }) {
  return (
    <div className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
      <span className="font-semibold text-slate-700">{label}: </span>
      {href ? (
        <a href={href} target="_blank" rel="noreferrer" className="font-bold text-blue-900 transition hover:text-blue-700">
          {text ?? 'Ver archivo'}
        </a>
      ) : (
        <span>Sin archivo</span>
      )}
    </div>
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

function TextArea({
  label,
  name,
  rows,
  defaultValue,
  required,
}: {
  label: string
  name: string
  rows: number
  defaultValue?: string
  required?: boolean
}) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      {label}
      <textarea
        name={name}
        rows={rows}
        defaultValue={defaultValue}
        required={required}
        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
      />
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
