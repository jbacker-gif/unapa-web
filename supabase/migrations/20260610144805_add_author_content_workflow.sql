create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'author' check (role in ('author', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.articles add column if not exists author_id uuid references public.profiles(id) on delete set null;
alter table public.photos add column if not exists author_id uuid references public.profiles(id) on delete set null;
alter table public.videos add column if not exists author_id uuid references public.profiles(id) on delete set null;
alter table public.media_categories add column if not exists created_by uuid references public.profiles(id) on delete set null;

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references public.profiles(id) on delete set null,
  category_id uuid references public.media_categories(id) on delete set null,
  title text not null,
  slug text not null unique,
  description text,
  body text,
  starts_at timestamptz not null,
  ends_at timestamptz,
  location text,
  cover_image_url text,
  cover_storage_path text,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint events_ends_after_start check (ends_at is null or ends_at >= starts_at)
);

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_events_updated_at on public.events;
create trigger set_events_updated_at
before update on public.events
for each row execute function public.set_updated_at();

create index if not exists profiles_role_idx on public.profiles(role);
create index if not exists articles_author_id_idx on public.articles(author_id);
create index if not exists photos_author_id_idx on public.photos(author_id);
create index if not exists videos_author_id_idx on public.videos(author_id);
create index if not exists media_categories_created_by_idx on public.media_categories(created_by);
create index if not exists events_author_id_idx on public.events(author_id);
create index if not exists events_category_id_idx on public.events(category_id);
create index if not exists events_status_starts_at_idx on public.events(status, starts_at desc);
create index if not exists events_slug_idx on public.events(slug);

alter table public.profiles enable row level security;
alter table public.events enable row level security;

create or replace function public.current_app_role()
returns text
language sql
stable
set search_path = public
as $$
  select coalesce(
    (select auth.jwt()) -> 'app_metadata' ->> 'role',
    (select role from public.profiles where id = (select auth.uid()))
  )
$$;

create or replace function public.is_content_manager()
returns boolean
language sql
stable
set search_path = public
as $$
  select public.current_app_role() in ('admin', 'author')
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
set search_path = public
as $$
  select public.current_app_role() = 'admin'
$$;

create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    case when new.raw_app_meta_data ->> 'role' in ('admin', 'author') then new.raw_app_meta_data ->> 'role' else 'author' end
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_profile on auth.users;
create trigger on_auth_user_created_profile
after insert on auth.users
for each row execute function public.handle_new_user_profile();

drop policy if exists "Public profiles are readable" on public.profiles;
drop policy if exists "Users can update their own profile" on public.profiles;
drop policy if exists "Admins can manage profiles" on public.profiles;

create policy "Public profiles are readable"
on public.profiles
for select
to anon, authenticated
using (true);

create policy "Users can update their own profile"
on public.profiles
for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id and role = (select role from public.profiles where id = (select auth.uid())));

create policy "Admins can manage profiles"
on public.profiles
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Anon can read categories" on public.media_categories;
drop policy if exists "Admins can manage categories" on public.media_categories;
drop policy if exists "Anon can read published photos" on public.photos;
drop policy if exists "Admins can manage photos" on public.photos;
drop policy if exists "Anon can read published videos" on public.videos;
drop policy if exists "Admins can manage videos" on public.videos;
drop policy if exists "Anon can read published articles" on public.articles;
drop policy if exists "Admins can manage articles" on public.articles;
drop policy if exists "Public can read categories" on public.media_categories;
drop policy if exists "Public can read published photos" on public.photos;
drop policy if exists "Public can read published videos" on public.videos;
drop policy if exists "Public can read published articles" on public.articles;

create policy "Public can read categories" on public.media_categories for select to anon, authenticated using (true);
create policy "Content managers can manage categories" on public.media_categories for all to authenticated using (public.is_content_manager()) with check (public.is_content_manager());
create policy "Public can read published articles" on public.articles for select to anon, authenticated using (status = 'published');
create policy "Authors can manage own articles" on public.articles for all to authenticated using (public.is_admin() or author_id = (select auth.uid())) with check (public.is_admin() or (public.is_content_manager() and author_id = (select auth.uid())));
create policy "Public can read published photos" on public.photos for select to anon, authenticated using (status = 'published');
create policy "Authors can manage own photos" on public.photos for all to authenticated using (public.is_admin() or author_id = (select auth.uid())) with check (public.is_admin() or (public.is_content_manager() and author_id = (select auth.uid())));
create policy "Public can read published videos" on public.videos for select to anon, authenticated using (status = 'published');
create policy "Authors can manage own videos" on public.videos for all to authenticated using (public.is_admin() or author_id = (select auth.uid())) with check (public.is_admin() or (public.is_content_manager() and author_id = (select auth.uid())));
create policy "Public can read published events" on public.events for select to anon, authenticated using (status = 'published');
create policy "Authors can manage own events" on public.events for all to authenticated using (public.is_admin() or author_id = (select auth.uid())) with check (public.is_admin() or (public.is_content_manager() and author_id = (select auth.uid())));

drop policy if exists "Admins can upload UNAPA media" on storage.objects;
drop policy if exists "Admins can update UNAPA media" on storage.objects;
drop policy if exists "Admins can delete UNAPA media" on storage.objects;
drop policy if exists "Content managers can upload UNAPA media" on storage.objects;
drop policy if exists "Content managers can update own UNAPA media" on storage.objects;
drop policy if exists "Content managers can delete own UNAPA media" on storage.objects;

create policy "Content managers can upload UNAPA media" on storage.objects for insert to authenticated with check (bucket_id = 'unapa-media' and public.is_content_manager());
create policy "Content managers can update own UNAPA media" on storage.objects for update to authenticated using (bucket_id = 'unapa-media' and (public.is_admin() or owner = (select auth.uid()))) with check (bucket_id = 'unapa-media' and (public.is_admin() or owner = (select auth.uid())));
create policy "Content managers can delete own UNAPA media" on storage.objects for delete to authenticated using (bucket_id = 'unapa-media' and (public.is_admin() or owner = (select auth.uid())));
