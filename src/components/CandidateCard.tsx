import type { Candidate } from "../data/candidates";

interface Props {
  candidate: Candidate;
  selected: boolean;
  onSelect: () => void;
}

export default function CandidateCard({
  candidate,
  selected,
  onSelect,
}: Props) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`relative flex flex-col text-left rounded-2xl border-2 overflow-hidden transition bg-white active:scale-[0.98] ${
        selected
          ? "border-ilustre-orange ring-4 ring-ilustre-orange/25"
          : "border-ilustre-blueLight/70"
      }`}
    >
      <span className="absolute top-2 left-2 z-10 bg-ilustre-blueDark text-white text-xs font-display font-semibold rounded-full h-7 w-7 flex items-center justify-center">
        {candidate.id}
      </span>

      {selected && (
        <span className="absolute top-2 right-2 z-10 bg-ilustre-orange text-white text-[11px] font-display font-bold uppercase tracking-wide rounded-full px-2.5 py-1 shadow">
          ✓ Mi voto
        </span>
      )}

      <div className="w-full aspect-square bg-ilustre-blueLight/20">
        <img
          src={candidate.image}
          alt={candidate.name}
          loading="lazy"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-3 flex items-center justify-between gap-2">
        <span className="font-display text-sm sm:text-base leading-tight text-ilustre-blueDark">
          {candidate.name}
        </span>
        <span
          aria-hidden
          className={`shrink-0 h-5 w-5 rounded border-2 flex items-center justify-center ${
            selected
              ? "bg-ilustre-orange border-ilustre-orange text-white"
              : "border-ilustre-blueDark/40"
          }`}
        >
          {selected && (
            <svg viewBox="0 0 12 10" className="h-3 w-3 fill-white">
              <path d="M1 5l3 3 7-7" stroke="white" strokeWidth="2" fill="none" />
            </svg>
          )}
        </span>
      </div>
    </button>
  );
}
