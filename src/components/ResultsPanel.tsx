import { useState } from "react";
import { supabase } from "../lib/supabase";

interface Result {
  candidate_name: string;
  pct: number;
}

export default function ResultsPanel() {
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<Result[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  async function handleToggle() {
    if (open) {
      setOpen(false);
      return;
    }

    setOpen(true);

    if (results) return;

    setLoading(true);
    setError(false);

    const { data, error: rpcError } = await supabase.rpc(
      "get_results_percent",
    );

    setLoading(false);

    if (rpcError || !data) {
      setError(true);
      return;
    }

    setResults(
      [...(data as Result[])].sort((a, b) => b.pct - a.pct),
    );
  }

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={handleToggle}
        className="w-full min-h-[52px] border-2 border-ilustre-blueDark text-ilustre-blueDark font-display uppercase tracking-wide text-base rounded-xl active:scale-[0.98] transition"
      >
        {open ? "Ocultar resultados" : "Ver resultados en vivo"}
      </button>

      {open && (
        <div className="mt-3 w-full bg-white rounded-2xl border-2 border-ilustre-blueLight p-5 text-left space-y-4">
          {loading && (
            <p className="text-sm text-ilustre-blueDark/60 text-center">
              Cargando...
            </p>
          )}

          {error && (
            <p className="text-sm text-red-600 text-center">
              No pudimos cargar los resultados. Intenta de nuevo.
            </p>
          )}

          {results && (
            <>
              {results.map((r) => (
                <div key={r.candidate_name} className="space-y-1">
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm font-medium text-ilustre-blueDark">
                      {r.candidate_name}
                    </span>
                    <span className="font-display text-lg text-ilustre-orange">
                      {r.pct}%
                    </span>
                  </div>
                  <div className="h-2.5 w-full bg-ilustre-blueLight/30 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-ilustre-orange rounded-full transition-all duration-500"
                      style={{ width: `${r.pct}%` }}
                    />
                  </div>
                </div>
              ))}
              <p className="text-[11px] text-ilustre-blueDark/40 text-center pt-1">
                Resultados parciales, se actualizan en tiempo real.
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
