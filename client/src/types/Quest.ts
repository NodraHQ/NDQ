import type { Rarity, WeaponCategory } from "./Equipment";

export type QuestCategory = "DAILY" | "WEEKLY" | "ACHIEVEMENT" | "EVENT";

export type QuestState =
  | "LOCKED" // requisito (ex: nível mínimo) ainda não foi atingido
  | "AVAILABLE" // desbloqueada, mas sem progresso ainda
  | "IN_PROGRESS" // já tem algum progresso, abaixo do alvo
  | "COMPLETED" // atingiu o alvo, recompensa ainda não resgatada
  | "CLAIMED"; // recompensa já resgatada — estado terminal

// Tipos de objetivo suportados hoje. Adicionar um novo objetivo é
// adicionar um caso aqui + um case em systems/quests.ts — o resto do
// sistema (estados, catálogo, reset) não muda.
export type QuestObjectiveType =
  | "COMPLETE_EXPEDITIONS"
  | "DEFEAT_SPONSORED_BOSS"
  | "DEFEAT_SPECIFIC_BOSS"
  | "REACH_LEVEL"
  | "EQUIP_RARITY"
  | "EARN_GOLD"
  | "REACH_MASTERY_LEVEL";

export type QuestObjective = {
  type: QuestObjectiveType;
  /** Quantidade necessária para completar (ou o valor-alvo, pra objetivos de patamar). */
  target: number;
  /** Usado só por DEFEAT_SPECIFIC_BOSS. */
  bossName?: string;
  /** Usado só por EQUIP_RARITY. */
  rarity?: Rarity;
  /** Usado só por REACH_MASTERY_LEVEL. */
  weaponCategory?: WeaponCategory;
};

export type QuestReward = {
  xp?: number;
  gold?: number;
  /** id em EQUIPMENT_CATALOG — concedido via drop no momento do resgate. */
  equipmentDefinitionId?: string;
};

export type QuestRequirements = {
  /** Nível mínimo do personagem para a missão sair de LOCKED e virar AVAILABLE. */
  minLevel?: number;
};

// Definição estática (catálogo) — igual para todo mundo.
export type QuestDefinition = {
  id: string;
  name: string;
  description: string;
  category: QuestCategory;
  objective: QuestObjective;
  reward: QuestReward;
  requirements?: QuestRequirements;
  /**
   * Apenas para EVENT: janela fixa de calendário em que a missão existe.
   * Fora dela a missão não deve conceder progresso nem ser reiniciada.
   */
  availableFrom?: number; // epoch ms
  availableUntil?: number; // epoch ms
};

// Estado específico de UM jogador para UMA missão. Isso é o que muda;
// QuestDefinition nunca muda em runtime.
export type QuestProgress = {
  questId: string;
  state: QuestState;
  progress: number;
  /**
   * Quando este ciclo expira e deve ser resetado (apenas DAILY/WEEKLY).
   * TODO(backend): a autoridade sobre "agora" e sobre quando resetar
   * precisa vir do servidor — o relógio do cliente não é confiável.
   */
  cycleEndsAt?: number;
};

export type QuestLog = Record<string, QuestProgress>; // chave: questId

// Eventos de domínio que o resto do jogo emite. O sistema de missões só
// conhece estes eventos — nunca importa Battle.tsx, Expedition.tsx etc.
// Isso é o que permite plugar o sistema sem acoplar a nenhuma tela.
export type QuestEvent =
  | { type: "EXPEDITION_COMPLETED"; dungeonId: string }
  | { type: "SPONSORED_BOSS_DEFEATED"; bossName: string }
  | { type: "LEVEL_REACHED"; level: number }
  | { type: "EQUIPMENT_EQUIPPED"; rarity: Rarity }
  | { type: "GOLD_EARNED"; amount: number }
  | { type: "MASTERY_LEVEL_REACHED"; category: WeaponCategory; level: number };
