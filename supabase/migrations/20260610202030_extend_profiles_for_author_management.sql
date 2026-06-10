alter table public.profiles add column if not exists phone text;
alter table public.profiles add column if not exists position text;
alter table public.profiles add column if not exists bio text;

drop policy if exists "Users can update their own profile" on public.profiles;
drop policy if exists "Admins can manage profiles" on public.profiles;

create policy "Users can update their own profile"
on public.profiles
for update
to authenticated
using ((select auth.uid()) = id)
with check (
  (select auth.uid()) = id
  and role = (select role from public.profiles where id = (select auth.uid()))
);

create policy "Admins can manage profiles"
on public.profiles
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());
