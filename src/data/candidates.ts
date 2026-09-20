import banderaCostena from "../assets/candidates/bandera-costena.webp";
import chopsueyCangrejo from "../assets/candidates/chopsuey-cangrejo.webp";
import morocloCostillar from "../assets/candidates/moroclo-costillar-placeholder.png";
import cazuelaIlustre from "../assets/candidates/cazuela-ilustre.webp";

export interface Candidate {
  id: number;
  name: string;
  image: string;
  /** true mientras se usa la imagen genérica en lo que llega la foto final */
  isPlaceholderImage?: boolean;
}

export const CANDIDATES: Candidate[] = [
  { id: 1, name: "Bandera Costeña", image: banderaCostena },
  { id: 2, name: "Chopsuey de Cangrejo", image: chopsueyCangrejo },
  {
    id: 3,
    name: "Moroclo con Costillar",
    image: morocloCostillar,
    isPlaceholderImage: true,
  },
  { id: 4, name: "Cazuela Ilustre", image: cazuelaIlustre },
];
