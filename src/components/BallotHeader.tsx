import logo from "../assets/logo-la-ilustre.png";

export default function BallotHeader() {
  return (
    <header className="w-full bg-white border-b-4 border-ilustre-blue">
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        <img src={logo} alt="La Ilustre" className="h-9 w-auto sm:h-10" />
        <span className="font-display uppercase tracking-wide text-[11px] sm:text-xs text-ilustre-blueDark bg-ilustre-blueLight/40 rounded-full px-3 py-1">
          Elecciones Ilustres 2026
        </span>
      </div>
    </header>
  );
}
