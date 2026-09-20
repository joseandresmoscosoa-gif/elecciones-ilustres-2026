interface Props {
  onStart: () => void;
}

export default function Entrada({ onStart }: Props) {
  return (
    <div className="flex flex-col items-center text-center min-h-[75vh] justify-center gap-6 animate-[fadeIn_0.4s_ease-out]">
      <div className="space-y-1">
        <p className="font-display uppercase tracking-[0.2em] text-xs text-ilustre-orange font-semibold">
          Elecciones Ilustres 2026
        </p>
        <h1 className="font-display uppercase text-4xl sm:text-5xl leading-tight text-ilustre-blueDark">
          Tu plato.
          <br />
          Tu voto.
        </h1>
      </div>

      <p className="text-ilustre-blueDark/80 text-base sm:text-lg max-w-xs">
        Elige a tu candidato Ilustre.
      </p>

      <button
        onClick={onStart}
        className="w-full max-w-xs min-h-[52px] bg-ilustre-orange hover:bg-ilustre-orangeDark active:scale-[0.98] transition text-white font-display uppercase tracking-wide text-lg rounded-xl shadow-ballot"
      >
        Votar ahora
      </button>

      <p className="text-xs text-ilustre-blueDark/50 max-w-xs">
        Las urnas cierran el domingo 22 de noviembre de 2026.
      </p>
    </div>
  );
}
