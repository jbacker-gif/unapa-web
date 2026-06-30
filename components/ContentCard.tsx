import Link from 'next/link'
import Image from 'next/image'
import { formatDate, formatDateTime } from '@/lib/content'

type CardProps = {
  title: string
  description?: string | null
  href?: string
  imageUrl?: string | null
  date?: string | null
  dateTime?: boolean
  meta?: string | null
  attachmentUrl?: string | null
  attachmentLabel?: string | null
}

export default function ContentCard({
  title,
  description,
  href,
  imageUrl,
  date,
  dateTime,
  meta,
  attachmentUrl,
  attachmentLabel,
}: CardProps) {
  const content = (
    <article className="h-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      {imageUrl ? (
        <div className="aspect-[16/9] bg-slate-100">
          <Image src={imageUrl} alt={title} width={640} height={360} className="h-full w-full object-cover" />
        </div>
      ) : (
        <div className="aspect-[16/9] bg-blue-900" />
      )}
      <div className="p-5">
        {(date || meta) && (
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-amber-600">
            {date ? (dateTime ? formatDateTime(date) : formatDate(date)) : meta}
          </p>
        )}
        <h2 className="text-xl font-bold text-slate-900">{title}</h2>
        {description && <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>}
        {attachmentUrl && (
          <a
            href={attachmentUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex rounded-md border border-blue-200 px-3 py-2 text-sm font-bold text-blue-900 transition hover:bg-blue-50"
          >
            {attachmentLabel ?? 'Ver PDF anexo'}
          </a>
        )}
      </div>
    </article>
  )

  if (!href) return content

  return (
    <Link href={href} className="block h-full">
      {content}
    </Link>
  )
}
