-- Production hardening for upgraded installations.
create extension if not exists pg_trgm;

-- These indexes match the server-side ILIKE predicates used by search.
create index if not exists algorithms_title_en_trgm_idx on public.algorithms using gin (title_en gin_trgm_ops);
create index if not exists algorithms_description_en_trgm_idx on public.algorithms using gin (description_en gin_trgm_ops);
create index if not exists algorithms_title_ru_trgm_idx on public.algorithms using gin (title_ru gin_trgm_ops);
create index if not exists algorithms_description_ru_trgm_idx on public.algorithms using gin (description_ru gin_trgm_ops);
create index if not exists algorithms_title_uz_trgm_idx on public.algorithms using gin (title_uz gin_trgm_ops);
create index if not exists algorithms_description_uz_trgm_idx on public.algorithms using gin (description_uz gin_trgm_ops);

drop index if exists public.algorithms_search_en_trgm_idx;
drop index if exists public.algorithms_search_ru_trgm_idx;
drop index if exists public.algorithms_search_uz_trgm_idx;

-- Profiles are provisioned by the trusted Supabase dashboard/SQL path. The app only reads the current user's role.
drop policy if exists "profiles_update_own" on public.profiles;
revoke update on table public.profiles from authenticated;

-- Keep code replacement atomic so an edit cannot leave stale or partially-written language rows.
create or replace function public.replace_algorithm_codes(
  p_algorithm_id uuid,
  p_codes jsonb
)
returns boolean
language plpgsql
security invoker
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'ADMIN_REQUIRED' using errcode = '42501';
  end if;

  delete from public.algorithm_code_versions
  where algorithm_id = p_algorithm_id;

  insert into public.algorithm_code_versions (algorithm_id, language, code)
  select
    p_algorithm_id,
    key::public.algorithm_language,
    value
  from jsonb_each_text(coalesce(p_codes, '{}'::jsonb))
  where key in ('cpp', 'python', 'javascript', 'typescript', 'java', 'go', 'rust')
    and char_length(trim(value)) > 0;

  return true;
end;
$$;

revoke all on function public.replace_algorithm_codes(uuid, jsonb) from public;
grant execute on function public.replace_algorithm_codes(uuid, jsonb) to authenticated;
