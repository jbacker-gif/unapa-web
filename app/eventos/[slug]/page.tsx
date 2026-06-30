import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { formatDateTime, getPublishedEventBySlug } from '@/lib/content'

export default async function EventoDetallePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const event = await getPublishedEventBySlug(slug)

  if (!event) notFound()

  return (
    <div className="bg-slate-50 py-16">
      <article className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Link href="/eventos" className="text-sm font-bold text-blue-900 transition hover:text-blue-700">
          Volver a eventos
        </Link>

        <header className="mt-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-amber-600">
            {formatDateTime(event.starts_at)}
          </p>
          <h1 className="mt-3 text-4xl font-extrabold text-blue-900">{event.title}</h1>
          {event.location && <p className="mt-3 text-sm font-semibold text-slate-500">{event.location}</p>}
          {event.description && <p className="mt-4 text-lg leading-8 text-slate-600">{event.description}</p>}
        </header>

        {event.cover_image_url && (
          <div className="mt-8 overflow-hidden rounded-lg bg-slate-100">
            <Image
              src={event.cover_image_url}
              alt={event.title}
              width={960}
              height={540}
              className="h-auto w-full object-cover"
            />
          </div>
        )}

        {event.body && <div className="mt-8 whitespace-pre-line text-base leading-8 text-slate-700">{event.body}</div>}

        {event.attachment_pdf_url && (
          <a
            href={event.attachment_pdf_url}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex rounded-md bg-blue-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-800"
          >
            {event.attachment_pdf_file_name ?? 'Ver PDF anexo'}
          </a>
        )}
      </article>
    </div>
  )
}
