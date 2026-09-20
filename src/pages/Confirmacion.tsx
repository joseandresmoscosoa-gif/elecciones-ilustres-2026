import type { VoteResult } from "../types";

interface Props {
  result: VoteResult;
}

export default function Confirmacion({ result }: Props) {
  return (
    <div className="flex flex-col items-center text-center gap-6 py-8 animate-[fadeIn_0.4s_ease-out]">
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

      <div className="w-full bg-white border-2 border-dashed border-ilustre-orange rounded-2xl p-5 space-y-3">
        <p className="font-display uppercase text-ilustre-blueDark text-base">
          Votar tiene premio
        </p>
        <p className="text-sm text-ilustre-blueDark/70">
          Recibe 25% de descuento en tu candidato en tu siguiente visita.
        </p>

        <div className="pt-2 space-y-1">
          <p className="text-xs uppercase tracking-wide text-ilustre-blueDark/50">
            Tu código de descuento
          </p>
          <p className="font-display text-2xl sm:text-3xl text-ilustre-orange tracking-wider">
            {result.couponCode}
          </p>
          <p className="text-xs text-ilustre-blueDark/50">
            25% OFF en tu candidato
          </p>
        </div>
      </div>

      <p className="text-sm text-ilustre-blueDark/70 max-w-xs">
        Si tu candidato gana, tú también puedes ganar. Sortearemos un{" "}
        <span className="font-semibold">Almuerzo Ilustre</span> entre quienes
        votaron por el candidato ganador.
      </p>
    </div>
  );
}
