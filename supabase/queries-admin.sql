-- Consultas administrativas — ejecutar en el SQL Editor de Supabase
-- (requiere estar autenticado como owner del proyecto; el frontend público
-- no tiene permisos para correr nada de esto, ver RLS en schema.sql).

-- 1) Resultados por candidato
select candidate_name, count(*) as votos
from public.votes
group by candidate_name
order by votos desc;

-- 2) Total de votantes
select count(*) as total_votantes from public.votes;

-- 3) Exportar para el sorteo (botón "Download CSV" en Table Editor,
--    o correr esto y exportar el resultado desde el editor SQL)
select
  name as "Nombre",
  phone as "Celular",
  email as "Email",
  candidate_name as "Candidato",
  created_at as "Fecha",
  coupon_code as "Código"
from public.votes
order by created_at asc;

-- 4) Exportar solo votantes del candidato ganador (para el sorteo del
--    Almuerzo Ilustre). Reemplazar el id por el del candidato ganador.
select
  name as "Nombre",
  phone as "Celular",
  email as "Email",
  coupon_code as "Código"
from public.votes
where candidate_id = 1 -- <-- cambiar por el id del ganador
order by created_at asc;

-- 5) Validar / canjear un cupón manualmente (fase 2: pantalla interna)
update public.votes
set coupon_redeemed = true,
    coupon_redeemed_at = now()
where coupon_code = 'ILU-XXXXXX'
  and coupon_redeemed = false
returning coupon_code, name, candidate_name;
