import { useState } from "react";
import type { VoteResult } from "../types";

interface Props {
  result: VoteResult;
}

export default function Confirmacion({ result }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(result.couponCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard no disponible, el código ya está visible para copiar a mano
    }
  }

  return (
    <div className="flex flex-col items-center text-center gap-5 py-6 animate-[fadeIn_0.4s_ease-out]">
      <div className="h-16 w-16 rounded-full bg-ilustre-orange/15 flex items-center justify-center">
        <svg viewBox="0 0 24 24" className="h-9 w-9 text-ilustre-orange">
          <path
            d="M4 12l5 5L20 6"
            stroke="currentColor"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="space-y-1">
        <h1 className="font-display uppercase text-2xl sm:text-3xl text-ilustre-blueDark">
          ¡Tu voto fue registrado!
        </h1>
        <p className="text-sm text-ilustre-blueDark/60">
          Votaste por{" "}
          <span className="font-semibold text-ilustre-orange">
            {result.candidateName}
          </span>
        </p>
      </div>

      {/* Premio: tarjeta protagonista */}
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
        <p className="text-sm text-white/85 mt-1">
          en tu candidato, en tu siguiente visita
        </p>

        <button
          type="button"
          onClick={handleCopy}
          className="w-full mt-5 bg-white rounded-2xl px-4 py-4 active:scale-[0.98] transition"
        >
          <p className="text-[11px] uppercase tracking-wide text-ilustre-blueDark/50">
            Tu código de descuento
          </p>
          <p className="font-display text-3xl sm:text-4xl text-ilustre-orange tracking-[0.15em] mt-1">
            {result.couponCode}
          </p>
          <p className="text-xs font-semibold text-ilustre-blueDark/60 mt-1">
            {copied ? "✓ Copiado" : "Toca para copiar"}
          </p>
        </button>
      </div>

      {/* Sorteo: tarjeta destacada */}
      <div className="w-full rounded-3xl bg-ilustre-blueDark p-6 text-white">
        <div className="flex justify-center mb-2">
          <span className="text-4xl">🏆</span>
        </div>
        <p className="font-display uppercase text-xl sm:text-2xl leading-tight">
          Si tu candidato gana,
          <br />
          tú también puedes ganar
        </p>
        <p className="text-sm text-white/80 mt-2">
          Sortearemos un{" "}
          <span className="font-display text-ilustre-orange text-base">
            Almuerzo Ilustre
          </span>{" "}
          entre quienes votaron por el candidato ganador.
        </p>
      </div>
    </div>
  );
}
