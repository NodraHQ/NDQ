import type { Rarity } from "../types/Equipment";
export type { Rarity };

export type SponsoredBoss = {
  name: string;
  sponsor: string;
  hp: number;
  atk: number;
  /** id em EQUIPMENT_CATALOG (data/equipment.ts) — a fonte real do item. */
  lootDefinitionId: string;
  /** Campos abaixo são só para exibição rápida nas telas de resultado;
   *  o item de verdade (stats, tier, categoria) vive no catálogo. */
  lootName: string;
  lootRarity: Rarity;
  lootStat: string;
  xp: number;
  gold: number;
};

export type Dungeon = {
  id: string;
  name: string;
  description: string;
  color: string;
  durationMs: number; // duração da expedição
  baseXp: number;
  baseGold: number;
  // chance (0-1) de um chefe patrocinado aparecer durante a expedição.
  // Isso deve ser sorteado no BACKEND quando a expedição é criada, nunca
  // no cliente — aqui é só o valor de referência usado pela simulação local.
  bossChance: number;
  boss: SponsoredBoss;
};

export const DUNGEONS: Dungeon[] = [
  {
    id: "emporio-estelar",
    name: "Empório Estelar",
    description: "Ruínas de pedra abaixo do empório mais antigo da região.",
    color: "#8b8f9b",
    durationMs: 20_000,
    baseXp: 18,
    baseGold: 8,
    bossChance: 0.12,
    boss: {
      name: "Golem de Pedra Antiga",
      sponsor: "Empório Estelar",
      hp: 60,
      atk: 9,
      lootDefinitionId: "escudo-de-granito",
      lootName: "Escudo de Granito",
      lootRarity: "Raro",
      lootStat: "+6 Defesa",
      xp: 60,
      gold: 30,
    },
  },
  {
    id: "mercado-da-vila",
    name: "Mercado da Vila",
    description: "Vielas úmidas nos fundos do mercado, cheias de criaturas gelatinosas.",
    color: "#4fbf6b",
    durationMs: 15_000,
    baseXp: 12,
    baseGold: 10,
    bossChance: 0.12,
    boss: {
      name: "Slime Rei",
      sponsor: "Mercado da Vila",
      hp: 46,
      atk: 7,
      lootDefinitionId: "anel-gelatinoso",
      lootName: "Anel Gelatinoso",
      lootRarity: "Comum",
      lootStat: "+8 HP máx.",
      xp: 40,
      gold: 20,
    },
  },
  {
    id: "botica-da-lua",
    name: "Botica da Lua",
    description: "Um sótão arcano onde a botica guarda seus segredos mais antigos.",
    color: "#5b4a9c",
    durationMs: 30_000,
    baseXp: 26,
    baseGold: 14,
    bossChance: 0.1,
    boss: {
      name: "Coruja Mística",
      sponsor: "Botica da Lua",
      hp: 70,
      atk: 11,
      lootDefinitionId: "cajado-das-estrelas",
      lootName: "Cajado das Estrelas",
      lootRarity: "Épico",
      lootStat: "+9 Ataque",
      xp: 90,
      gold: 45,
    },
  },
];
