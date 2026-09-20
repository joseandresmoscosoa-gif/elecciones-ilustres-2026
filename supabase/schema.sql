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

-- El visitante SOLO puede insertar su propio voto. No puede leer, editar
-- ni eliminar votos (ninguna policy de select/update/delete para anon).
drop policy if exists "votes_public_insert" on public.votes;
create policy "votes_public_insert"
  on public.votes for insert
  to anon
  with check (true);

-- Nota: las consultas administrativas (resultados, exportación CSV,
-- validación de cupones) deben hacerse desde el panel de Supabase o con
-- la Service Role Key en un entorno de servidor, NUNCA desde el frontend.
