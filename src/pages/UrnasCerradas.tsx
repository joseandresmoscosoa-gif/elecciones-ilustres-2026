import BallotHeader from "../components/BallotHeader";

export default function UrnasCerradas() {
  return (
    <div className="min-h-screen flex flex-col bg-ilustre-cream">
      <BallotHeader />
      <main className="flex-1 flex flex-col items-center justify-center text-center gap-4 px-6">
        <h1 className="font-display uppercase text-3xl text-ilustre-blueDark">
          Urnas cerradas
        </h1>
        <p className="text-ilustre-blueDark/70 max-w-xs">
          Gracias por participar en Elecciones Ilustres 2026. Muy pronto
          conoceremos al candidato ganador.
        </p>
      </main>
    </div>
  );
}
