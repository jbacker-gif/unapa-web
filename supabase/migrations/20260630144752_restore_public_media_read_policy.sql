drop policy if exists "Public can read UNAPA media" on storage.objects;

create policy "Public can read UNAPA media"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'unapa-media');
