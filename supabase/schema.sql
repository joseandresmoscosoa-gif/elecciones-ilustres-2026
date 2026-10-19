-- Elecciones Ilustres 2026 — esquema de base de datos
-- Ejecutar en el SQL Editor de Supabase (proyecto del cliente)

create extension if not exists "pgcrypto";

-- =========================================================
-- Tabla: candidates
-- =========================================================
create table if not exists public.candidates (
  id integer primary key,
  number integer not null,
  name text not null,
  image_url text,
  active boolean not null default true
);

insert into public.candidates (id, number, name, active) values
  (1, 1, 'Bandera Costeña', true),
  (2, 2, 'Chopsuey de Cangrejo', true),
  (3, 3, 'Moroclo con Costillar', true),
  (4, 4, 'Cazuela Ilustre', true)
on conflict (id) do nothing;

-- =========================================================
-- Tabla: votes
-- =========================================================
create table if not exists public.votes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  phone text not null,
  phone_normalized text not null unique,
  email text,
  candidate_id integer not null references public.candidates(id),
  candidate_name text not null,
  coupon_code text unique,
  coupon_redeemed boolean not null default false,
  coupon_redeemed_at timestamptz,
  marketing_consent boolean not null default false
);

create index if not exists votes_candidate_id_idx on public.votes (candidate_id);

-- =========================================================
-- Generación automática de cupón único (ILU-XXXXXX)
-- =========================================================
create or replace function public.generate_coupon_code()
returns text
language plpgsql
as $$
declare
  candidate_code text;
  exists_already boolean;
begin
  loop
    candidate_code := 'ILU-' || upper(substring(md5(gen_random_uuid()::text) from 1 for 6));
    select exists(select 1 from public.votes where coupon_code = candidate_code) into exists_already;
    exit when not exists_already;
  end loop;
  return candidate_code;
end;
$$;

create or replace function public.set_vote_defaults()
returns trigger
language plpgsql
as $$
begin
  if new.coupon_code is null then
    new.coupon_code := public.generate_coupon_code();
  end if;
  return new;
end;
$$;

drop trigger if exists trg_set_vote_defaults on public.votes;
create trigger trg_set_vote_defaults
  before insert on public.votes
  for each row
  execute function public.set_vote_defaults();

-- =========================================================
-- Bloqueo de nuevos votos tras el cierre de urnas
-- Cambiar la fecha si el cliente la modifica.
-- =========================================================
create or replace function public.enforce_urnas_abiertas()
returns trigger
language plpgsql
as $$
begin
  if now() > timestamptz '2026-11-22 23:59:59-05:00' then
    raise exception 'URNAS_CERRADAS: la votación ha finalizado';
  end if;
  return new;
end;
$$;

drop trigger if exists trg_enforce_urnas_abiertas on public.votes;
create trigger trg_enforce_urnas_abiertas
  before insert on public.votes
  for each row
  execute function public.enforce_urnas_abiertas();

-- =========================================================
-- Row Level Security
-- =========================================================
alter table public.votes enable row level security;
alter table public.candidates enable row level security;

-- El público puede leer el listado de candidatos (nombre/foto), nada más.
drop policy if exists "candidates_public_read" on public.candidates;
create policy "candidates_public_read"
  on public.candidates for select
  to anon
  using (active = true);

-- El visitante NO tiene ningún acceso directo a la tabla votes (ni insert,
-- ni select, ni nada). Solo puede votar a través de la función
-- submit_vote() de abajo, que corre con privilegios elevados (security
-- definer) y expone únicamente lo mínimo necesario: registrar el voto y
-- devolver el código de cupón. Así, aunque alguien intente leer o
-- manipular la tabla directamente vía la API, no puede.
drop policy if exists "votes_public_insert" on public.votes;
revoke insert, select, update, delete on public.votes from anon;

-- =========================================================
-- Función pública para votar (única puerta de entrada a votes)
-- =========================================================
create or replace function public.submit_vote(
  p_name text,
  p_phone text,
  p_phone_normalized text,
  p_email text,
  p_candidate_id integer,
  p_candidate_name text,
  p_marketing_consent boolean
)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_coupon text;
begin
  if now() > timestamptz '2026-11-22 23:59:59-05:00' then
    raise exception 'URNAS_CERRADAS: la votación ha finalizado';
  end if;

  v_coupon := public.generate_coupon_code();

  insert into public.votes (
    name, phone, phone_normalized, email,
    candidate_id, candidate_name, coupon_code, marketing_consent
  ) values (
    p_name, p_phone, p_phone_normalized, p_email,
    p_candidate_id, p_candidate_name, v_coupon, p_marketing_consent
  );

  return v_coupon;
end;
$$;

revoke all on function public.submit_vote from public;
grant execute on function public.submit_vote to anon;

-- =========================================================
-- Resultados públicos en porcentaje (sin números absolutos)
-- Se muestra al votante después de confirmar su voto. Nunca expone
-- el conteo real de votos, solo el porcentaje relativo por candidato,
-- por eso es seguro dejarla pública incluso con las urnas abiertas.
-- =========================================================
create or replace function public.get_results_percent()
returns table(candidate_name text, pct numeric)
language sql
stable
security definer
set search_path = public
as $$
  with total as (
    select count(*)::numeric as n from public.votes
  )
  select
    c.name as candidate_name,
    coalesce(round(count(v.id) / nullif((select n from total), 0) * 100, 1), 0) as pct
  from public.candidates c
  left join public.votes v on v.candidate_id = c.id
  where c.active = true
  group by c.name, c.number
  order by c.number;
$$;

revoke all on function public.get_results_percent from public;
grant execute on function public.get_results_percent to anon;

-- =========================================================
-- "Encuentra tu cupón": el votante busca su propio voto con su
-- celular. Devuelve SOLO la fila de ese celular (nunca la lista de
-- votos), y solo los campos necesarios para mostrar el cupón.
-- =========================================================
create or replace function public.normalize_phone_ec(p_phone text)
returns text
language sql
immutable
as $$
  select case
    when regexp_replace(p_phone, '\D', '', 'g') like '593%'
      then '+' || regexp_replace(p_phone, '\D', '', 'g')
    when regexp_replace(p_phone, '\D', '', 'g') like '0%'
      then '+593' || substring(regexp_replace(p_phone, '\D', '', 'g') from 2)
    when length(regexp_replace(p_phone, '\D', '', 'g')) = 9
      then '+593' || regexp_replace(p_phone, '\D', '', 'g')
    else '+' || regexp_replace(p_phone, '\D', '', 'g')
  end;
$$;

create or replace function public.find_my_vote(p_phone text)
returns table(
  candidate_name text,
  coupon_code text,
  coupon_redeemed boolean
)
language sql
stable
security definer
set search_path = public
as $$
  select v.candidate_name, v.coupon_code, v.coupon_redeemed
  from public.votes v
  where v.phone_normalized = public.normalize_phone_ec(p_phone)
  limit 1;
$$;

revoke all on function public.normalize_phone_ec from public;
revoke all on function public.find_my_vote from public;
grant execute on function public.find_my_vote to anon;

-- Nota: las consultas administrativas con números absolutos
-- (exportación CSV, validación de cupones) deben hacerse desde el
-- panel de Supabase o con la Service Role Key en un entorno de
-- servidor, NUNCA desde el frontend.
