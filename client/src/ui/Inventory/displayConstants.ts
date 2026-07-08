import type { Rarity } from "../../types/Equipment";

// Cores de raridade usadas nos cards e no painel de detalhes do
// inventário. Isso é puramente apresentação — systems/equipment.ts e
// data/equipment.ts não sabem que isso existe, de propósito.
export const RARITY_COLORS: Record<Rarity, string> = {
  Comum: "#5fa85f",
  Raro: "#4a7fd6",
  Épico: "#9b5bd6",
  Lendário: "#e08a3c",
};

export const CATEGORY_LABELS: Record<string, string> = {
  espada: "Espada",
  cajado: "Cajado",
  arco: "Arco",
  machado: "Machado",
  adaga: "Adaga",
};
