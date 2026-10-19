import { FormEvent, useState } from "react";
import { supabase } from "../lib/supabase";

interface Props {
  onBack: () => void;
}

interface FoundVote {
  candidate_name: string;
  coupon_code: string;
  coupon_redeemed: boolean;
}

type SearchState =
  | { status: "idle" }
  | { status: "searching" }
  | { status: "not-found" }
  | { status: "error" }
  | { status: "found"; vote: FoundVote };

export default function BuscarCupon({ onBack }: Props) {
  const [phone, setPhone] = useState("");
  const [state, setState] = useState<SearchState>({ status: "idle" });

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!phone.trim()) return;

    setState({ status: "searching" });

    const { data, error } = await supabase
      .rpc("find_my_vote", { p_phone: phone.trim() })
      .maybeSingle();

    if (error) {
      setState({ status: "error" });
      return;
    }

    if (!data) {
      setState({ status: "not-found" });
      return;
    }

    setState({ status: "found", vote: data as FoundVote });
  }

  return (
    <div className="flex flex-col gap-5 py-4">
      <button
        type="button"
        onClick={onBack}
        className="self-start text-sm text-ilustre-blueDark/70 flex items-center gap-1"
      >
        ← Volver
      </button>

      <div className="space-y-1 text-center">
        <h2 className="font-display uppercase text-xl sm:text-2xl text-ilustre-blueDark">
          Encuentra tu cupón
        </h2>
        <p className="text-sm text-ilustre-blueDark/60">
          Ingresa el celular con el que votaste
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          required
          type="tel"
          inputMode="numeric"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="0991234567"
          autoComplete="tel"
          className="w-full min-h-[48px] rounded-xl border-2 border-ilustre-blueLight px-4 text-base focus:outline-none focus:border-ilustre-orange"
        />
        <button
          type="submit"
          disabled={state.status === "searching"}
          className="w-full min-h-[52px] bg-ilustre-orange disabled:bg-ilustre-blueLight disabled:cursor-not-allowed hover:bg-ilustre-orangeDark active:scale-[0.98] transition text-white font-display uppercase tracking-wide text-lg rounded-xl shadow-ballot"
        >
          {state.status === "searching" ? "Buscando..." : "Buscar mi cupón"}
        </button>
      </form>

      {state.status === "not-found" && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 text-center">
          No encontramos ningún voto con ese celular. Revisa que esté bien
          escrito.
        </p>
      )}

      {state.status === "error" && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 text-center">
          No pudimos buscar tu cupón. Intenta nuevamente.
        </p>
      )}

      {state.status === "found" && (
        <div className="flex flex-col items-center text-center gap-4 animate-[fadeIn_0.4s_ease-out]">
          <p className="text-sm text-ilustre-blueDark/60">
            Votaste por{" "}
            <span className="font-semibold text-ilustre-orange">
              {state.vote.candidate_name}
            </span>
          </p>

          <div className="w-full rounded-3xl bg-gradient-to-br from-ilustre-orange to-ilustre-orangeDark p-6 text-white shadow-ballot">
            <p className="font-display uppercase tracking-wide text-sm text-white/85">
              Votar tiene premio
            </p>
            <p className="font-display text-6xl sm:text-7xl leading-none mt-2">
              25%
            </p>
            <p className="font-display uppercase text-lg sm:text-xl mt-1">
              de descuento
            </p>

            <div className="w-full mt-5 bg-white rounded-2xl px-4 py-4">
              <p className="text-[11px] uppercase tracking-wide text-ilustre-blueDark/50">
                Tu código de descuento
              </p>
              <p className="font-display text-3xl sm:text-4xl text-ilustre-orange tracking-[0.15em] mt-1">
                {state.vote.coupon_code}
              </p>
              {state.vote.coupon_redeemed && (
                <p className="text-xs font-semibold text-ilustre-blueDark/50 mt-1">
                  Ya fue canjeado
                </p>
              )}
            </div>
          </div>

          <p className="text-sm text-ilustre-blueDark/70">
            Guarda o captura este cupón y preséntalo en tu próxima visita a
            La Ilustre.
          </p>
        </div>
      )}
    </div>
  );
}
