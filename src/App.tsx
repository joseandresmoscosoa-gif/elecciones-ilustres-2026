import { useState } from "react";
import { urnasAbiertas } from "./lib/election";
import { CANDIDATES } from "./data/candidates";
import type { Step, VoteResult } from "./types";
import Entrada from "./pages/Entrada";
import Papeleta from "./pages/Papeleta";
import Registro from "./pages/Registro";
import Confirmacion from "./pages/Confirmacion";
import UrnasCerradas from "./pages/UrnasCerradas";
import BallotHeader from "./components/BallotHeader";

export default function App() {
  const [step, setStep] = useState<Step>("entrada");
  const [selectedCandidateId, setSelectedCandidateId] = useState<
    number | null
  >(null);
  const [voteResult, setVoteResult] = useState<VoteResult | null>(null);

  if (!urnasAbiertas()) {
    return <UrnasCerradas />;
  }

  const selectedCandidate = CANDIDATES.find(
    (c) => c.id === selectedCandidateId,
  );

  return (
    <div className="min-h-screen flex flex-col bg-ilustre-cream">
      <BallotHeader />
      <main className="flex-1 w-full max-w-md mx-auto px-4 pb-10 pt-4 sm:max-w-lg md:max-w-2xl">
        {step === "entrada" && (
          <Entrada onStart={() => setStep("papeleta")} />
        )}

        {step === "papeleta" && (
          <Papeleta
            selectedId={selectedCandidateId}
            onSelect={setSelectedCandidateId}
            onContinue={() => setStep("registro")}
          />
        )}

        {step === "registro" && selectedCandidate && (
          <Registro
            candidate={selectedCandidate}
            onBack={() => setStep("papeleta")}
            onVoted={(result) => {
              setVoteResult(result);
              setStep("confirmacion");
            }}
          />
        )}

        {step === "confirmacion" && voteResult && (
          <Confirmacion result={voteResult} />
        )}
      </main>
    </div>
  );
}
