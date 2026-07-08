import type { EquipmentDefinition } from "../types/Equipment";

// Nível mínimo do personagem pra desbloquear cada tier de equipamento.
// TODO(backend): quando o backend existir, esta é a fonte de verdade
// que deve ser espelhada/validada no servidor — nunca confiar só na
// checagem feita no cliente (ver canEquip em systems/equipment.ts).
export const TIER_LEVEL_REQUIREMENTS: Record<number, number> = {
  1: 1,
  2: 5,
  3: 10,
  4: 18,
  5: 28,
};

export function minLevelForTier(tier: number): number {
  return TIER_LEVEL_REQUIREMENTS[tier] ?? Infinity;
}

// Catálogo de equipamentos que existem no jogo.
//
// Regra imutável: equipamentos só entram no jogo por drop. Não existe
// (ainda) nenhuma função de "comprar" um item deste catálogo — só
// receiveEquipmentDrop(), chamada a partir do resultado de uma
// expedição ou de uma vitória contra chefe patrocinado.
export const EQUIPMENT_CATALOG: EquipmentDefinition[] = [
  {
    id: "espada-enferrujada",
    name: "Espada Enferrujada",
    slot: "weapon",
    category: "espada",
    tier: 1,
    rarity: "Comum",
    stats: { atk: 3 },
  },
  {
    id: "cajado-aprendiz",
    name: "Cajado de Aprendiz",
    slot: "weapon",
    category: "cajado",
    tier: 1,
    rarity: "Comum",
    stats: { atk: 2 },
  },
  {
    id: "escudo-de-granito",
    name: "Escudo de Granito",
    slot: "armor",
    tier: 1,
    rarity: "Raro",
    stats: { def: 6 },
  },
  {
    id: "anel-gelatinoso",
    name: "Anel Gelatinoso",
    slot: "armor",
    tier: 1,
    rarity: "Comum",
    stats: { hp: 8 },
  },
  {
    id: "cajado-das-estrelas",
    name: "Cajado das Estrelas",
    slot: "weapon",
    category: "cajado",
    tier: 2,
    rarity: "Épico",
    stats: { atk: 9 },
    requiredMastery: { category: "cajado", level: 3 },
  },
];

export function getEquipmentDefinition(id: string): EquipmentDefinition | undefined {
  return EQUIPMENT_CATALOG.find((item) => item.id === id);
}
