# Elecciones Ilustres 2026 — La Ilustre

Landing interactiva tipo "papeleta electoral" para que los clientes de **La
Ilustre** voten por su plato favorito escaneando un QR, dejen sus datos y
reciban un cupón de 25% de descuento. Mobile-first, 100% responsive.

Flujo: `QR → Candidato → Datos → Confirmación y premio`.

---

## 1. Estado del boceto

- Diseño y flujo completo implementado según brief (`Brief_para_desarollo_Elecciones_Ilustres.docx`).
- 3 de 4 candidatos con foto final:
  - Bandera Costeña ✅
  - Chopsuey de Cangrejo ✅
  - Cazuela Ilustre ✅
  - **Moroclo con Costillar** → usando imagen genérica temporal (`src/assets/candidates/moroclo-costillar-placeholder.png`). Cuando llegue la foto real, reemplazar ese archivo (o el import en `src/data/candidates.ts`) y listo, no requiere más cambios de código.
- Colores tomados del logo entregado: azul `#3B7C9D` y naranja `#DF7D46` (`tailwind.config.js`).
- Backend de datos (Supabase) modelado pero **no conectado todavía** — falta crear el proyecto Supabase y completar `.env.local` (ver sección 4).

---

## 2. Arquitectura técnica

Arquitectura simple, la misma que usamos en este tipo de activaciones:

```
Claude  →  GitHub  →  Netlify       (código y despliegue)
                          ↑
                      Supabase       (base de datos, fuera del repo)
```

| Capa | Tecnología | Por qué |
|---|---|---|
| Frontend | **React + Vite + TypeScript** | Liviano, arranca rápido, ideal para una landing de un solo flujo. |
| Estilos | **Tailwind CSS** | Responsive mobile-first con breakpoints y componentes fluidos, sin CSS a mano. |
| Base de datos | **Supabase (Postgres)** | Guarda votos, candidatos, cupones. RLS para que el público solo pueda insertar, nunca leer. |
| Hosting | **Netlify** | Deploy automático desde GitHub, dominio + HTTPS gratis, config vía `netlify.toml`. |
| Repositorio | **GitHub** | Versionamiento y conexión Netlify ↔ código. No almacena votos. |

No se agregó nada adicional (sin backend propio, sin CMS, sin librerías pesadas) — así lo definimos en el brief: "no implementar tecnologías adicionales si no son necesarias".

### Flujo de datos

```
Usuario escanea QR
   → Landing (Vite, estática, servida por Netlify)
   → Selecciona candidato (estado local en React)
   → Llena formulario (nombre, celular, email opcional)
   → INSERT directo a Supabase (anon key, protegido por RLS)
       ├─ trigger normaliza duplicados vía UNIQUE(phone_normalized)
       └─ trigger genera coupon_code único (ILU-XXXXXX)
   → Pantalla de confirmación con el cupón
```

---

## 3. Estructura del proyecto

```
src/
  assets/
    candidates/        fotos de los 4 platos (webp) + placeholder
    logo-la-ilustre.png
  components/
    BallotHeader.tsx   header con logo
    CandidateCard.tsx  tarjeta táctil (foto + nombre + casillero)
  data/
    candidates.ts      los 4 candidatos (id, nombre, imagen)
  lib/
    supabase.ts        cliente Supabase (usa las env vars)
    phone.ts           normalización de celular EC + validación
    election.ts         fecha de cierre de urnas
  pages/
    Entrada.tsx        Paso 1
    Papeleta.tsx       Paso 2
    Registro.tsx       Paso 3
    Confirmacion.tsx   Paso 4
    UrnasCerradas.tsx  pantalla post-cierre
  App.tsx              orquesta el flujo de 4 pasos
supabase/
  schema.sql           tablas, RLS, triggers (correr en Supabase)
  queries-admin.sql     resultados, exportación CSV, canje de cupón
netlify.toml           build command, publish dir, redirects SPA, headers
```

---

## 4. Puesta en marcha

### 4.1 Instalar y correr local

```bash
npm install
cp .env.example .env.local   # completar con las credenciales de Supabase
npm run dev
```

### 4.2 Crear el proyecto en Supabase

1. Crear un proyecto nuevo en [supabase.com](https://supabase.com).
2. Abrir **SQL Editor** y correr `supabase/schema.sql` completo. Esto crea:
   - Tabla `candidates` (con los 4 platos ya insertados).
   - Tabla `votes` con `phone_normalized UNIQUE` (evita doble voto) y `coupon_code UNIQUE` (autogenerado por trigger).
   - Trigger que bloquea nuevos votos después del **22 de noviembre de 2026**.
   - **Row Level Security**: el público (`anon`) solo puede `INSERT` en `votes`. No puede leer, editar ni borrar votos, ni ver a otros participantes. Nunca se expone la `service_role key` en el frontend.
3. Copiar `Project URL` y `anon public key` (Settings → API) a `.env.local`.

### 4.3 Deploy

1. Subir el repo a GitHub (rama `main`).
2. En [Netlify](https://app.netlify.com) → **Add new site → Import an existing project** → conectar el repo de GitHub.
3. Netlify detecta `netlify.toml` automáticamente (`npm run build`, publica `dist/`). No hace falta configurar nada manualmente.
4. Agregar las env vars `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` en **Site configuration → Environment variables**.
5. Deploy. Cada push a `main` vuelve a desplegar automáticamente (deploy previews en cada PR también, gratis).
6. Generar el QR apuntando a la URL de Netlify (o dominio propio si se conecta en **Domain management**).

---

## 5. Administración (sin dashboard, fase 1)

Todo se administra desde el **Table Editor / SQL Editor de Supabase**, sin construir un panel:

- **Resultados y export CSV**: correr las queries en `supabase/queries-admin.sql`, o exportar directo la tabla `votes` desde Table Editor (botón *Export as CSV*).
- **Sorteo del Almuerzo Ilustre**: filtrar votantes del candidato ganador (query #4) y exportar esa lista.
- **Canje de cupón**: marcar `coupon_redeemed = true` manualmente (query #5) hasta que se justifique construir la pantalla de validación (fase 2).
- Los resultados **no deben mostrarse públicamente** mientras las urnas estén abiertas — por eso no hay ninguna pantalla pública de resultados en este boceto.

### Fase 2 (opcional, futura)

- Pantalla interna `/admin` para validar cupones en caja.
- Página pública `RESULTADOS ELECCIONES ILUSTRES` una vez cerradas las urnas.

---

## 6. Checklist de aceptación (responsive)

- [x] Mobile-first: diseñado primero para celular, no adaptado desde desktop.
- [x] Sin scroll horizontal, sin elementos cortados, sin fotos deformadas (`object-fit: cover`).
- [x] Tarjeta completa del candidato es tocable (no solo el checkbox).
- [x] Botones con altura táctil ≥ 48px.
- [x] Papeleta 2×2 en móvil, 1 columna en pantallas muy pequeñas (< 360px), más horizontal en tablet/desktop.
- [x] Formularios de 1 columna en móvil, teclado numérico en el campo celular.
- [ ] Probar manualmente en 320 / 375 / 390 / 430 / 768 / 1024 px antes de dar por cerrado el flujo completo con Supabase conectado.

---

## 7. Pendientes para cerrar el boceto

1. Reemplazar la imagen placeholder de **Moroclo con Costillar** cuando llegue la foto final.
2. Crear el proyecto Supabase real y correr `schema.sql`.
3. Confirmar copy final (textos ya están tomados literalmente del brief).
4. Deploy a Netlify + generación del QR físico para el restaurante.
