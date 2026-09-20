import { CANDIDATES } from "../data/candidates";
import CandidateCard from "../components/CandidateCard";

interface Props {
  selectedId: number | null;
  onSelect: (id: number) => void;
  onContinue: () => void;
}

export default function Papeleta({ selectedId, onSelect, onContinue }: Props) {
  return (
    <div className="flex flex-col gap-5 py-4">
      <div className="text-center space-y-1">
        <h2 className="font-display uppercase text-xl sm:text-2xl text-ilustre-blueDark">
          Elige un solo candidato
        </h2>
        <p className="text-sm text-ilustre-blueDark/60">
          Toca la foto de tu plato favorito
        </p>
      </div>

      <div className="grid grid-cols-1 min-[360px]:grid-cols-2 gap-3">
        {CANDIDATES.map((candidate) => (
          <CandidateCard
            key={candidate.id}
            candidate={candidate}
            selected={selectedId === candidate.id}
            onSelect={() => onSelect(candidate.id)}
          />
        ))}
      </div>

      <button
        type="button"
        disabled={selectedId === null}
        onClick={onContinue}
        className="w-full min-h-[52px] bg-ilustre-orange disabled:bg-ilustre-blueLight disabled:cursor-not-allowed hover:bg-ilustre-orangeDark active:scale-[0.98] transition text-white font-display uppercase tracking-wide text-lg rounded-xl shadow-ballot"
      >
        Continuar
      </button>
    </div>
  );
}
