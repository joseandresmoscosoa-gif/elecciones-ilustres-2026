import { FormEvent, useState } from "react";
import type { Candidate } from "../data/candidates";
import type { VoteResult, VoterForm } from "../types";
import { isValidPhoneEC, normalizePhoneEC } from "../lib/phone";
import { supabase } from "../lib/supabase";

interface Props {
  candidate: Candidate;
  onBack: () => void;
  onVoted: (result: VoteResult) => void;
}

type SubmitState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "duplicate" }
  | { status: "error" };

export default function Registro({ candidate, onBack, onVoted }: Props) {
  const [form, setForm] = useState<VoterForm>({
    name: "",
    phone: "",
    email: "",
    dataConsent: false,
    marketingConsent: false,
  });
  const [submitState, setSubmitState] = useState<SubmitState>({
    status: "idle",
  });

  const phoneValid = isValidPhoneEC(form.phone);
  const canSubmit =
    form.name.trim().length >= 2 && phoneValid && form.dataConsent;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setSubmitState({ status: "submitting" });

    const phoneNormalized = normalizePhoneEC(form.phone);

    const { data, error } = await supabase
      .from("votes")
      .insert({
        name: form.name.trim(),
        phone: form.phone.trim(),
        phone_normalized: phoneNormalized,
        email: form.email.trim() || null,
        candidate_id: candidate.id,
        candidate_name: candidate.name,
        marketing_consent: form.marketingConsent,
      })
      .select("coupon_code")
      .single();

    if (error) {
      // 23505 = violación de UNIQUE (celular duplicado) en Postgres
      if (error.code === "23505") {
        setSubmitState({ status: "duplicate" });
      } else {
        setSubmitState({ status: "error" });
      }
      return;
    }

    onVoted({
      couponCode: data.coupon_code as string,
      candidateName: candidate.name,
    });
  }

  return (
    <div className="flex flex-col gap-5 py-4">
      <button
        type="button"
        onClick={onBack}
        className="self-start text-sm text-ilustre-blueDark/70 flex items-center gap-1"
      >
        ← Cambiar candidato
      </button>

      <div className="space-y-1">
        <h2 className="font-display uppercase text-xl sm:text-2xl text-ilustre-blueDark">
          Registra tu voto
        </h2>
        <p className="text-sm text-ilustre-blueDark/70">
          Tu voto:{" "}
          <span className="font-semibold text-ilustre-orange">
            {candidate.name}
          </span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-ilustre-blueDark">
            Nombre
          </span>
          <input
            required
            minLength={2}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Tu nombre"
            autoComplete="name"
            className="w-full min-h-[48px] rounded-xl border-2 border-ilustre-blueLight px-4 text-base focus:outline-none focus:border-ilustre-orange"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-ilustre-blueDark">
            Celular
          </span>
          <input
            required
            type="tel"
            inputMode="numeric"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="0991234567"
            autoComplete="tel"
            className="w-full min-h-[48px] rounded-xl border-2 border-ilustre-blueLight px-4 text-base focus:outline-none focus:border-ilustre-orange"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-ilustre-blueDark">
            Correo electrónico{" "}
            <span className="text-ilustre-blueDark/40 font-normal">
              (opcional)
            </span>
          </span>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="tu@correo.com"
            autoComplete="email"
            className="w-full min-h-[48px] rounded-xl border-2 border-ilustre-blueLight px-4 text-base focus:outline-none focus:border-ilustre-orange"
          />
        </label>

        <label className="flex items-start gap-3 text-sm text-ilustre-blueDark/80">
          <input
            type="checkbox"
            required
            checked={form.dataConsent}
            onChange={(e) =>
              setForm({ ...form, dataConsent: e.target.checked })
            }
            className="mt-0.5 h-5 w-5 shrink-0 accent-ilustre-orange"
          />
          Acepto el tratamiento de mis datos para fines de esta votación.
        </label>

        <label className="flex items-start gap-3 text-sm text-ilustre-blueDark/80">
          <input
            type="checkbox"
            checked={form.marketingConsent}
            onChange={(e) =>
              setForm({ ...form, marketingConsent: e.target.checked })
            }
            className="mt-0.5 h-5 w-5 shrink-0 accent-ilustre-orange"
          />
          Quiero recibir promociones de La Ilustre.
        </label>

        {submitState.status === "duplicate" && (
          <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
            Este número ya registró su voto en Elecciones Ilustres.
          </p>
        )}
        {submitState.status === "error" && (
          <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
            No pudimos registrar tu voto. Intenta nuevamente.
          </p>
        )}

        <button
          type="submit"
          disabled={!canSubmit || submitState.status === "submitting"}
          className="w-full min-h-[52px] bg-ilustre-orange disabled:bg-ilustre-blueLight disabled:cursor-not-allowed hover:bg-ilustre-orangeDark active:scale-[0.98] transition text-white font-display uppercase tracking-wide text-lg rounded-xl shadow-ballot"
        >
          {submitState.status === "submitting"
            ? "Registrando..."
            : "Confirmar mi voto"}
        </button>
      </form>
    </div>
  );
}
