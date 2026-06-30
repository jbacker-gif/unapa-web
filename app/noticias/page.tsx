import ContentCard from '@/components/ContentCard'
import EmptyState from '@/components/EmptyState'
import { getPublishedArticles } from '@/lib/content'

export default async function NoticiasPage() {
  const articles = await getPublishedArticles()

  return (
    <div className="bg-slate-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-3xl">
          <h1 className="text-4xl font-extrabold text-blue-900">Noticias y artículos</h1>
          <p className="mt-4 text-lg text-slate-600">
            Actualizaciones institucionales, análisis profesional y publicaciones de los autores autorizados por UNAPA.
          </p>
        </div>

        {articles.length === 0 ? (
          <EmptyState
            title="Aún no hay noticias publicadas"
            text="Cuando los autores publiquen artículos desde el panel, aparecerán en esta sección."
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ContentCard
                key={article.id}
                title={article.title}
                description={article.excerpt}
                href={`/noticias/${article.slug}`}
                imageUrl={article.cover_image_url}
                date={article.published_at ?? article.created_at}
                meta={article.author_name}
                attachmentUrl={article.attachment_pdf_url}
                attachmentLabel={article.attachment_pdf_file_name ?? 'Ver PDF anexo'}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
