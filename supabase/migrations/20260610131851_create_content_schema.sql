create table if not exists public.media_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.photos (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.media_categories(id) on delete set null,
  title text not null,
  description text,
  image_url text,
  storage_path text,
  alt_text text,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  sort_order integer not null default 0,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint photos_image_source_check check (image_url is not null or storage_path is not null)
);

create table if not exists public.videos (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.media_categories(id) on delete set null,
  title text not null,
  description text,
  video_url text,
  storage_path text,
  thumbnail_url text,
  provider text,
  duration_seconds integer check (duration_seconds is null or duration_seconds >= 0),
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  sort_order integer not null default 0,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint videos_source_check check (video_url is not null or storage_path is not null)
);

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.media_categories(id) on delete set null,
  title text not null,
  slug text not null unique,
  excerpt text,
  body text not null,
  cover_image_url text,
  cover_storage_path text,
  author_name text,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_media_categories_updated_at on public.media_categories;
create trigger set_media_categories_updated_at
before update on public.media_categories
for each row execute function public.set_updated_at();

drop trigger if exists set_photos_updated_at on public.photos;
create trigger set_photos_updated_at
before update on public.photos
for each row execute function public.set_updated_at();

drop trigger if exists set_videos_updated_at on public.videos;
create trigger set_videos_updated_at
before update on public.videos
for each row execute function public.set_updated_at();

drop trigger if exists set_articles_updated_at on public.articles;
create trigger set_articles_updated_at
before update on public.articles
for each row execute function public.set_updated_at();

create index if not exists media_categories_slug_idx on public.media_categories(slug);
create index if not exists photos_status_published_at_idx on public.photos(status, published_at desc);
create index if not exists videos_status_published_at_idx on public.videos(status, published_at desc);
create index if not exists articles_status_published_at_idx on public.articles(status, published_at desc);
create index if not exists articles_slug_idx on public.articles(slug);

alter table public.media_categories enable row level security;
alter table public.photos enable row level security;
alter table public.videos enable row level security;
alter table public.articles enable row level security;

create policy "Public can read categories"
on public.media_categories
for select
to anon, authenticated
using (true);

create policy "Admins can manage categories"
on public.media_categories
for all
to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy "Public can read published photos"
on public.photos
for select
to anon, authenticated
using (status = 'published');

create policy "Admins can manage photos"
on public.photos
for all
to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy "Public can read published videos"
on public.videos
for select
to anon, authenticated
using (status = 'published');

create policy "Admins can manage videos"
on public.videos
for all
to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy "Public can read published articles"
on public.articles
for select
to anon, authenticated
using (status = 'published');

create policy "Admins can manage articles"
on public.articles
for all
to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'unapa-media',
  'unapa-media',
  true,
  104857600,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Public can read UNAPA media"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'unapa-media');

create policy "Admins can upload UNAPA media"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'unapa-media' and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy "Admins can update UNAPA media"
on storage.objects
for update
to authenticated
using (bucket_id = 'unapa-media' and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check (bucket_id = 'unapa-media' and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy "Admins can delete UNAPA media"
on storage.objects
for delete
to authenticated
using (bucket_id = 'unapa-media' and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
