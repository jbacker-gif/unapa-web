import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { formatDate, getPublishedArticleBySlug } from '@/lib/content'

export default async function NoticiaDetallePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const article = await getPublishedArticleBySlug(slug)

  if (!article) notFound()

  return (
    <div className="bg-slate-50 py-16">
      <article className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Link href="/noticias" className="text-sm font-bold text-blue-900 transition hover:text-blue-700">
          Volver a noticias
        </Link>

        <header className="mt-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-amber-600">
            {formatDate(article.published_at ?? article.created_at)}
          </p>
          <h1 className="mt-3 text-4xl font-extrabold text-blue-900">{article.title}</h1>
          {article.excerpt && <p className="mt-4 text-lg leading-8 text-slate-600">{article.excerpt}</p>}
          {article.author_name && <p className="mt-3 text-sm font-semibold text-slate-500">{article.author_name}</p>}
        </header>

        {article.cover_image_url && (
          <div className="mt-8 overflow-hidden rounded-lg bg-slate-100">
            <Image
              src={article.cover_image_url}
              alt={article.title}
              width={960}
              height={540}
              className="h-auto w-full object-cover"
            />
          </div>
        )}

        <div className="mt-8 whitespace-pre-line text-base leading-8 text-slate-700">{article.body}</div>

        {article.attachment_pdf_url && (
          <a
            href={article.attachment_pdf_url}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex rounded-md bg-blue-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-800"
          >
            {article.attachment_pdf_file_name ?? 'Ver PDF anexo'}
          </a>
        )}
      </article>
    </div>
  )
}
