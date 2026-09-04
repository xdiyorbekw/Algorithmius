create extension if not exists pgcrypto;
create extension if not exists pg_trgm;

create type public.app_role as enum ('admin', 'editor');
create type public.algorithm_language as enum ('cpp', 'python', 'javascript', 'typescript', 'java', 'go', 'rust');

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.app_role not null default 'editor',
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.algorithms (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  title_en text not null,
  title_ru text not null,
  title_uz text not null,
  description_en text not null,
  description_ru text not null,
  description_uz text not null,
  published boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint algorithms_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint algorithms_title_length check (char_length(title_en) between 1 and 160 and char_length(title_ru) between 1 and 160 and char_length(title_uz) between 1 and 160),
  constraint algorithms_description_length check (char_length(description_en) between 1 and 2000 and char_length(description_ru) between 1 and 2000 and char_length(description_uz) between 1 and 2000)
);

create table if not exists public.algorithm_code_versions (
  id uuid primary key default gen_random_uuid(),
  algorithm_id uuid not null references public.algorithms(id) on delete cascade,
  language public.algorithm_language not null,
  code text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint algorithm_code_versions_code_length check (char_length(code) between 1 and 50000),
  constraint algorithm_code_versions_algorithm_language_unique unique (algorithm_id, language)
);

create unique index if not exists algorithms_slug_uidx on public.algorithms (slug);
create index if not exists algorithms_published_title_en_idx on public.algorithms (published, title_en);
create index if not exists algorithms_published_title_ru_idx on public.algorithms (published, title_ru);
create index if not exists algorithms_published_title_uz_idx on public.algorithms (published, title_uz);
create index if not exists algorithms_updated_at_idx on public.algorithms (updated_at desc);
create index if not exists algorithms_title_en_trgm_idx on public.algorithms using gin (title_en gin_trgm_ops);
create index if not exists algorithms_description_en_trgm_idx on public.algorithms using gin (description_en gin_trgm_ops);
create index if not exists algorithms_title_ru_trgm_idx on public.algorithms using gin (title_ru gin_trgm_ops);
create index if not exists algorithms_description_ru_trgm_idx on public.algorithms using gin (description_ru gin_trgm_ops);
create index if not exists algorithms_title_uz_trgm_idx on public.algorithms using gin (title_uz gin_trgm_ops);
create index if not exists algorithms_description_uz_trgm_idx on public.algorithms using gin (description_uz gin_trgm_ops);
create index if not exists algorithm_code_versions_algorithm_idx on public.algorithm_code_versions (algorithm_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists algorithms_set_updated_at on public.algorithms;
create trigger algorithms_set_updated_at
before update on public.algorithms
for each row execute function public.set_updated_at();

drop trigger if exists algorithm_code_versions_set_updated_at on public.algorithm_code_versions;
create trigger algorithm_code_versions_set_updated_at
before update on public.algorithm_code_versions
for each row execute function public.set_updated_at();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

alter table public.profiles enable row level security;
alter table public.algorithms enable row level security;
alter table public.algorithm_code_versions enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles for select to authenticated using (id = auth.uid());

drop policy if exists "algorithms_public_read" on public.algorithms;
create policy "algorithms_public_read" on public.algorithms for select to anon, authenticated using (published = true or public.is_admin());

drop policy if exists "algorithms_admin_insert" on public.algorithms;
create policy "algorithms_admin_insert" on public.algorithms for insert to authenticated with check (public.is_admin());

drop policy if exists "algorithms_admin_update" on public.algorithms;
create policy "algorithms_admin_update" on public.algorithms for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "algorithms_admin_delete" on public.algorithms;
create policy "algorithms_admin_delete" on public.algorithms for delete to authenticated using (public.is_admin());

drop policy if exists "algorithm_code_versions_public_read" on public.algorithm_code_versions;
create policy "algorithm_code_versions_public_read" on public.algorithm_code_versions for select to anon, authenticated using (exists (select 1 from public.algorithms a where a.id = algorithm_id and (a.published = true or public.is_admin())));

drop policy if exists "algorithm_code_versions_admin_insert" on public.algorithm_code_versions;
create policy "algorithm_code_versions_admin_insert" on public.algorithm_code_versions for insert to authenticated with check (public.is_admin());

drop policy if exists "algorithm_code_versions_admin_update" on public.algorithm_code_versions;
create policy "algorithm_code_versions_admin_update" on public.algorithm_code_versions for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "algorithm_code_versions_admin_delete" on public.algorithm_code_versions;
create policy "algorithm_code_versions_admin_delete" on public.algorithm_code_versions for delete to authenticated using (public.is_admin());

revoke all on table public.profiles from anon;
revoke all on table public.algorithms from anon, authenticated;
revoke all on table public.algorithm_code_versions from anon, authenticated;
grant select on table public.algorithms to anon, authenticated;
grant select on table public.algorithm_code_versions to anon, authenticated;
grant select on table public.profiles to authenticated;
grant insert, update, delete on table public.algorithms to authenticated;
grant insert, update, delete on table public.algorithm_code_versions to authenticated;
