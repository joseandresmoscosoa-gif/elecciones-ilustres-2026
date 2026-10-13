import banderaCostena from "../assets/candidates/bandera-costena.webp";
import chopsueyCangrejo from "../assets/candidates/chopsuey-cangrejo.webp";
import morocloCostillar from "../assets/candidates/moroclo-costillar.webp";
import cazuelaIlustre from "../assets/candidates/cazuela-ilustre.webp";

export interface Candidate {
  id: number;
  name: string;
  image: string;
}

export const CANDIDATES: Candidate[] = [
  { id: 1, name: "Bandera Costeña", image: banderaCostena },
  { id: 2, name: "Chopsuey de Cangrejo", image: chopsueyCangrejo },
  { id: 3, name: "Moroclo con Costillar", image: morocloCostillar },
  { id: 4, name: "Cazuela Ilustre", image: cazuelaIlustre },
];
