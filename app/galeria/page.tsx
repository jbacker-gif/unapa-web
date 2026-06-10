import EmptyState from '@/components/EmptyState'
import { getPublishedPhotos, getPublishedVideos } from '@/lib/content'
import Image from 'next/image'

export default async function GaleriaPage() {
  const [photos, videos] = await Promise.all([getPublishedPhotos(), getPublishedVideos()])

  return (
    <div className="bg-slate-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-3xl">
          <h1 className="text-4xl font-extrabold text-blue-900">Galería de fotos y videos</h1>
          <p className="mt-4 text-lg text-slate-600">
            Memoria visual de eventos, actividades institucionales y contenido multimedia de UNAPA.
          </p>
        </div>

        <section>
          <h2 className="mb-6 text-2xl font-bold text-slate-900">Fotos</h2>
          {photos.length === 0 ? (
            <EmptyState
              title="Aún no hay fotos publicadas"
              text="Las imágenes cargadas y publicadas por autores aparecerán en esta galería."
            />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {photos.map((photo) => (
                <figure key={photo.id} className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                  <div className="aspect-[4/3] bg-slate-100">
                    <Image
                      src={photo.image_url ?? ''}
                      alt={photo.alt_text ?? photo.title}
                      width={640}
                      height={480}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <figcaption className="p-4">
                    <h3 className="font-bold text-slate-900">{photo.title}</h3>
                    {photo.description && <p className="mt-2 text-sm text-slate-600">{photo.description}</p>}
                  </figcaption>
                </figure>
              ))}
            </div>
          )}
        </section>

        <section className="mt-16">
          <h2 className="mb-6 text-2xl font-bold text-slate-900">Videos</h2>
          {videos.length === 0 ? (
            <EmptyState
              title="Aún no hay videos publicados"
              text="Los videos cargados o enlazados por autores aparecerán en esta sección."
            />
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {videos.map((video) => (
                <article key={video.id} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                  <h3 className="text-xl font-bold text-slate-900">{video.title}</h3>
                  {video.description && <p className="mt-2 text-sm text-slate-600">{video.description}</p>}
                  {video.video_url && (
                    <a
                      href={video.video_url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 inline-flex rounded-md bg-blue-900 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-800"
                    >
                      Ver video
                    </a>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
