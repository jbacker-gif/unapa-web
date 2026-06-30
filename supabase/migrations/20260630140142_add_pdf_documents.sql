create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references public.profiles(id) on delete set null,
  category_id uuid references public.media_categories(id) on delete set null,
  title text not null,
  description text,
  file_url text not null,
  storage_path text,
  file_name text,
  mime_type text not null default 'application/pdf',
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  sort_order integer not null default 0,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint documents_pdf_mime_type_check check (mime_type = 'application/pdf')
);

drop trigger if exists set_documents_updated_at on public.documents;
create trigger set_documents_updated_at
before update on public.documents
for each row execute function public.set_updated_at();

create index if not exists documents_author_id_idx on public.documents(author_id);
create index if not exists documents_category_id_idx on public.documents(category_id);
create index if not exists documents_status_published_at_idx on public.documents(status, published_at desc);

alter table public.documents enable row level security;

drop policy if exists "Public can read published documents" on public.documents;
drop policy if exists "Authors can manage own documents" on public.documents;

create policy "Public can read published documents"
on public.documents
for select
to anon, authenticated
using (status = 'published');

create policy "Authors can manage own documents"
on public.documents
for all
to authenticated
using (public.is_admin() or author_id = (select auth.uid()))
with check (public.is_admin() or (public.is_content_manager() and author_id = (select auth.uid())));

update storage.buckets
set allowed_mime_types = array[
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'video/mp4',
  'video/webm',
  'application/pdf'
]
where id = 'unapa-media';
