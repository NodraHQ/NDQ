// Tipos do sistema de equipamentos e classes.
//
// Regra imutável: a classe do personagem é sempre DERIVADA da categoria
// da arma equipada. Não existe seleção manual de classe em nenhum lugar
// deste sistema.

export type WeaponCategory = "espada" | "cajado" | "arco" | "machado" | "adaga";

export type CharacterClass =
  | "Guerreiro"
  | "Mago"
  | "Arqueiro"
  | "Berserker"
  | "Assassino"
  | "Sem Classe"; // estado sem nenhuma arma equipada

export const WEAPON_CATEGORY_TO_CLASS: Record<WeaponCategory, CharacterClass> = {
  espada: "Guerreiro",
  cajado: "Mago",
  arco: "Arqueiro",
  machado: "Berserker",
  adaga: "Assassino",
};

export type EquipmentSlot = "weapon" | "armor";

export type Rarity = "Comum" | "Raro" | "Épico" | "Lendário";

export type StatBonuses = {
  atk?: number;
  def?: number;
  hp?: number;
};

// Definição "molde" de um equipamento — o catálogo do jogo (dados
// estáticos, iguais pra todo mundo). Ver client/src/data/equipment.ts.
export type EquipmentDefinition = {
  id: string;
  name: string;
  slot: EquipmentSlot;
  /** Obrigatório apenas para slot "weapon" — é o que define a classe. */
  category?: WeaponCategory;
  /** Tier 1, 2, 3... Quanto maior, maior o nível mínimo pra equipar. */
  tier: number;
  rarity: Rarity;
  stats: StatBonuses;
  /**
   * Requisito opcional de maestria pra equipar (ex: um cajado avançado
   * que só pode ser usado por quem já tem maestria em cajados).
   * Adicionado nesta sprint do Inventário — nenhum item antigo tinha
   * esse campo, e ele é opcional, então nada existente quebra.
   */
  requiredMastery?: { category: WeaponCategory; level: number };
};

// Uma unidade específica que um jogador possui. Instâncias podem ser
// destruídas (regra imutável: equipamentos podem quebrar em expedições),
// então nunca é a mesma coisa que a "definição" acima.
export type EquipmentInstance = {
  instanceId: string;
  definitionId: string;
  obtainedAt: number; // Date.now() no momento do drop
  broken: boolean;
  // TODO(backend): quando existir o mint on-chain (Soroban), este
  // instanceId deve corresponder ao identificador do NFT do item, e
  // "broken" deve refletir o estado real registrado on-chain.
};
