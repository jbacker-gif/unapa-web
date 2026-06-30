import ContentCard from '@/components/ContentCard'
import EmptyState from '@/components/EmptyState'
import { getPublishedEvents } from '@/lib/content'

export default async function EventosPage() {
  const events = await getPublishedEvents()

  return (
    <div className="bg-slate-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-3xl">
          <h1 className="text-4xl font-extrabold text-blue-900">Eventos</h1>
          <p className="mt-4 text-lg text-slate-600">
            Actividades, congresos, capacitaciones y encuentros de la comunidad profesional de administración.
          </p>
        </div>

        {events.length === 0 ? (
          <EmptyState
            title="Aún no hay eventos publicados"
            text="Los próximos eventos aparecerán aquí cuando sean publicados desde el panel de autores."
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <ContentCard
                key={event.id}
                title={event.title}
                description={event.description}
                imageUrl={event.cover_image_url}
                date={event.starts_at}
                dateTime
                meta={event.location}
                attachmentUrl={event.attachment_pdf_url}
                attachmentLabel={event.attachment_pdf_file_name ?? 'Ver PDF anexo'}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
