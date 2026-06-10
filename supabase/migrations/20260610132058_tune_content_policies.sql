drop policy if exists "Public can read UNAPA media" on storage.objects;

drop policy if exists "Public can read categories" on public.media_categories;
drop policy if exists "Admins can manage categories" on public.media_categories;
drop policy if exists "Public can read published photos" on public.photos;
drop policy if exists "Admins can manage photos" on public.photos;
drop policy if exists "Public can read published videos" on public.videos;
drop policy if exists "Admins can manage videos" on public.videos;
drop policy if exists "Public can read published articles" on public.articles;
drop policy if exists "Admins can manage articles" on public.articles;
drop policy if exists "Admins can upload UNAPA media" on storage.objects;
drop policy if exists "Admins can update UNAPA media" on storage.objects;
drop policy if exists "Admins can delete UNAPA media" on storage.objects;

create index if not exists photos_category_id_idx on public.photos(category_id);
create index if not exists videos_category_id_idx on public.videos(category_id);
create index if not exists articles_category_id_idx on public.articles(category_id);

create policy "Anon can read categories"
on public.media_categories
for select
to anon
using (true);

create policy "Admins can manage categories"
on public.media_categories
for all
to authenticated
using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin')
with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

create policy "Anon can read published photos"
on public.photos
for select
to anon
using (status = 'published');

create policy "Admins can manage photos"
on public.photos
for all
to authenticated
using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin')
with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

create policy "Anon can read published videos"
on public.videos
for select
to anon
using (status = 'published');

create policy "Admins can manage videos"
on public.videos
for all
to authenticated
using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin')
with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

create policy "Anon can read published articles"
on public.articles
for select
to anon
using (status = 'published');

create policy "Admins can manage articles"
on public.articles
for all
to authenticated
using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin')
with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

create policy "Admins can upload UNAPA media"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'unapa-media' and ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

create policy "Admins can update UNAPA media"
on storage.objects
for update
to authenticated
using (bucket_id = 'unapa-media' and ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin')
with check (bucket_id = 'unapa-media' and ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

create policy "Admins can delete UNAPA media"
on storage.objects
for delete
to authenticated
using (bucket_id = 'unapa-media' and ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');
