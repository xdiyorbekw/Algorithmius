do $$
begin
  if not exists (select 1 from pg_type where typname = 'algorithm_language') then
    create type public.algorithm_language as enum ('cpp', 'python', 'javascript', 'typescript', 'java', 'go', 'rust');
  end if;
end $$;

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

alter table public.algorithms drop constraint if exists algorithms_code_length;

do $$
begin
  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'algorithms' and column_name = 'language')
     and exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'algorithms' and column_name = 'code') then
    insert into public.algorithm_code_versions (algorithm_id, language, code)
    select id, language, code from public.algorithms
    where language is not null and code is not null
    on conflict (algorithm_id, language) do nothing;
  end if;
end $$;

do $$
begin
  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'algorithms' and column_name = 'language') then
    alter table public.algorithms alter column language drop not null;
  end if;
  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'algorithms' and column_name = 'code') then
    alter table public.algorithms alter column code drop not null;
  end if;
end $$;

create index if not exists algorithm_code_versions_algorithm_idx on public.algorithm_code_versions (algorithm_id);

drop trigger if exists algorithm_code_versions_set_updated_at on public.algorithm_code_versions;
create trigger algorithm_code_versions_set_updated_at
before update on public.algorithm_code_versions
for each row execute function public.set_updated_at();

alter table public.algorithm_code_versions enable row level security;

drop policy if exists "algorithm_code_versions_public_read" on public.algorithm_code_versions;
create policy "algorithm_code_versions_public_read" on public.algorithm_code_versions for select to anon, authenticated using (exists (select 1 from public.algorithms a where a.id = algorithm_id and (a.published = true or public.is_admin())));

drop policy if exists "algorithm_code_versions_admin_insert" on public.algorithm_code_versions;
create policy "algorithm_code_versions_admin_insert" on public.algorithm_code_versions for insert to authenticated with check (public.is_admin());

drop policy if exists "algorithm_code_versions_admin_update" on public.algorithm_code_versions;
create policy "algorithm_code_versions_admin_update" on public.algorithm_code_versions for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "algorithm_code_versions_admin_delete" on public.algorithm_code_versions;
create policy "algorithm_code_versions_admin_delete" on public.algorithm_code_versions for delete to authenticated using (public.is_admin());

revoke all on table public.algorithm_code_versions from anon, authenticated;
grant select on table public.algorithm_code_versions to anon, authenticated;
grant insert, update, delete on table public.algorithm_code_versions to authenticated;
