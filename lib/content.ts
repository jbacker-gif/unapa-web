import { hasSupabaseEnv } from './supabase/env'
import { createClient } from './supabase/server'
import type { Database } from './supabase/types'

export type Article = Database['public']['Tables']['articles']['Row']
export type Event = Database['public']['Tables']['events']['Row']
export type Photo = Database['public']['Tables']['photos']['Row']
export type Video = Database['public']['Tables']['videos']['Row']
export type ManagedContentType = 'articles' | 'events' | 'photos' | 'videos'

export function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function formatDate(value: string | null) {
  if (!value) return ''
  return new Intl.DateTimeFormat('es-DO', {
    dateStyle: 'medium',
    timeZone: 'America/Santo_Domingo',
  }).format(new Date(value))
}

export function formatDateTime(value: string | null) {
  if (!value) return ''
  return new Intl.DateTimeFormat('es-DO', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'America/Santo_Domingo',
  }).format(new Date(value))
}

export async function getPublishedArticles(limit?: number): Promise<Article[]> {
  if (!hasSupabaseEnv()) return []
  const supabase = await createClient()
  let query = supabase
    .from('articles')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })

  if (limit) query = query.limit(limit)

  const { data } = await query
  return data ?? []
}

export async function getPublishedEvents(limit?: number): Promise<Event[]> {
  if (!hasSupabaseEnv()) return []
  const supabase = await createClient()
  let query = supabase
    .from('events')
    .select('*')
    .eq('status', 'published')
    .order('starts_at', { ascending: true })

  if (limit) query = query.limit(limit)

  const { data } = await query
  return data ?? []
}

export async function getPublishedPhotos(limit?: number): Promise<Photo[]> {
  if (!hasSupabaseEnv()) return []
  const supabase = await createClient()
  let query = supabase
    .from('photos')
    .select('*')
    .eq('status', 'published')
    .order('sort_order', { ascending: true })
    .order('published_at', { ascending: false, nullsFirst: false })

  if (limit) query = query.limit(limit)

  const { data } = await query
  return data ?? []
}

export async function getPublishedVideos(limit?: number): Promise<Video[]> {
  if (!hasSupabaseEnv()) return []
  const supabase = await createClient()
  let query = supabase
    .from('videos')
    .select('*')
    .eq('status', 'published')
    .order('sort_order', { ascending: true })
    .order('published_at', { ascending: false, nullsFirst: false })

  if (limit) query = query.limit(limit)

  const { data } = await query
  return data ?? []
}

export async function getAuthorContent(userId: string) {
  if (!hasSupabaseEnv()) {
    return { articles: [], events: [], photos: [], videos: [] }
  }

  const supabase = await createClient()
  const [articles, events, photos, videos] = await Promise.all([
    supabase.from('articles').select('*').eq('author_id', userId).order('created_at', { ascending: false }).limit(8),
    supabase.from('events').select('*').eq('author_id', userId).order('created_at', { ascending: false }).limit(8),
    supabase.from('photos').select('*').eq('author_id', userId).order('created_at', { ascending: false }).limit(8),
    supabase.from('videos').select('*').eq('author_id', userId).order('created_at', { ascending: false }).limit(8),
  ])

  return {
    articles: articles.data ?? [],
    events: events.data ?? [],
    photos: photos.data ?? [],
    videos: videos.data ?? [],
  }
}

export async function getManagedContent(userId: string, isAdmin: boolean) {
  if (!hasSupabaseEnv()) {
    return { articles: [], events: [], photos: [], videos: [] }
  }

  const supabase = await createClient()

  const articlesQuery = supabase.from('articles').select('*').order('created_at', { ascending: false }).limit(20)
  const eventsQuery = supabase.from('events').select('*').order('created_at', { ascending: false }).limit(20)
  const photosQuery = supabase.from('photos').select('*').order('created_at', { ascending: false }).limit(20)
  const videosQuery = supabase.from('videos').select('*').order('created_at', { ascending: false }).limit(20)

  if (!isAdmin) {
    articlesQuery.eq('author_id', userId)
    eventsQuery.eq('author_id', userId)
    photosQuery.eq('author_id', userId)
    videosQuery.eq('author_id', userId)
  }

  const [articles, events, photos, videos] = await Promise.all([
    articlesQuery,
    eventsQuery,
    photosQuery,
    videosQuery,
  ])

  return {
    articles: articles.data ?? [],
    events: events.data ?? [],
    photos: photos.data ?? [],
    videos: videos.data ?? [],
  }
}
