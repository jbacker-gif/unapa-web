'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { slugify } from '@/lib/content'
import { hasSupabaseEnv } from '@/lib/supabase/env'
import { createClient } from '@/lib/supabase/server'

type ContentType = 'article' | 'event' | 'photo' | 'video'
type AuthorProfile = { id: string; role: string; full_name: string | null }

function publishedAt(status: string) {
  return status === 'published' ? new Date().toISOString() : null
}

async function requireAuthor() {
  if (!hasSupabaseEnv()) redirect('/login?error=config')

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profileData } = await supabase
    .from('profiles')
    .select('id, role, full_name')
    .eq('id', user.id)
    .single()
  const profile = profileData as AuthorProfile | null

  if (!profile || !['author', 'admin'].includes(profile.role)) {
    redirect('/login?error=invalid')
  }

  return { supabase, user, profile }
}

async function uploadMedia(file: File | null, folder: string, userId: string) {
  if (!file || file.size === 0) return { publicUrl: null, path: null }

  const { supabase } = await requireAuthor()
  const extension = file.name.split('.').pop() || 'bin'
  const path = `${folder}/${userId}/${crypto.randomUUID()}.${extension}`
  const { error } = await supabase.storage.from('unapa-media').upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  })

  if (error) {
    throw new Error(error.message)
  }

  const { data } = supabase.storage.from('unapa-media').getPublicUrl(path)
  return { publicUrl: data.publicUrl, path }
}

function getFile(formData: FormData, name: string) {
  const value = formData.get(name)
  return value instanceof File ? value : null
}

export async function createContent(formData: FormData) {
  const { supabase, user, profile } = await requireAuthor()
  const type = String(formData.get('type') ?? '') as ContentType
  const title = String(formData.get('title') ?? '').trim()
  const status = String(formData.get('status') ?? 'draft')

  if (!title || !['draft', 'published'].includes(status)) {
    redirect('/panel?error=invalid')
  }

  const slug = `${slugify(title)}-${Date.now().toString(36)}`
  const authorName = profile.full_name ?? user.email ?? 'UNAPA'

  if (type === 'article') {
    const body = String(formData.get('body') ?? '').trim()
    const excerpt = String(formData.get('excerpt') ?? '').trim()
    const cover = getFile(formData, 'cover')
    const media = await uploadMedia(cover, 'articles', user.id)

    const { error } = await supabase.from('articles').insert({
      author_id: user.id,
      author_name: authorName,
      body,
      cover_image_url: media.publicUrl,
      cover_storage_path: media.path,
      excerpt,
      published_at: publishedAt(status),
      slug,
      status,
      title,
    })

    if (error) redirect('/panel?error=save')
  }

  if (type === 'event') {
    const startsAt = String(formData.get('starts_at') ?? '')
    const cover = getFile(formData, 'cover')
    const media = await uploadMedia(cover, 'events', user.id)

    const { error } = await supabase.from('events').insert({
      author_id: user.id,
      body: String(formData.get('body') ?? '').trim() || null,
      cover_image_url: media.publicUrl,
      cover_storage_path: media.path,
      description: String(formData.get('description') ?? '').trim() || null,
      location: String(formData.get('location') ?? '').trim() || null,
      published_at: publishedAt(status),
      slug,
      starts_at: startsAt ? new Date(startsAt).toISOString() : new Date().toISOString(),
      status,
      title,
    })

    if (error) redirect('/panel?error=save')
  }

  if (type === 'photo') {
    const image = getFile(formData, 'media')
    const media = await uploadMedia(image, 'photos', user.id)

    if (!media.publicUrl) redirect('/panel?error=media')

    const { error } = await supabase.from('photos').insert({
      alt_text: String(formData.get('alt_text') ?? '').trim() || title,
      author_id: user.id,
      description: String(formData.get('description') ?? '').trim() || null,
      image_url: media.publicUrl,
      published_at: publishedAt(status),
      status,
      storage_path: media.path,
      title,
    })

    if (error) redirect('/panel?error=save')
  }

  if (type === 'video') {
    const mediaFile = getFile(formData, 'media')
    const uploaded = await uploadMedia(mediaFile, 'videos', user.id)
    const videoUrl = String(formData.get('video_url') ?? '').trim() || uploaded.publicUrl

    if (!videoUrl) redirect('/panel?error=media')

    const { error } = await supabase.from('videos').insert({
      author_id: user.id,
      description: String(formData.get('description') ?? '').trim() || null,
      provider: uploaded.publicUrl ? 'upload' : 'external',
      published_at: publishedAt(status),
      status,
      storage_path: uploaded.path,
      title,
      video_url: videoUrl,
    })

    if (error) redirect('/panel?error=save')
  }

  revalidatePath('/', 'layout')
  revalidatePath('/noticias')
  revalidatePath('/eventos')
  revalidatePath('/galeria')
  redirect('/panel?saved=1')
}
