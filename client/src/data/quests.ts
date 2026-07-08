import type { QuestDefinition } from "../types/Quest";

// Constantes de tempo — evita valores mágicos espalhados pelo sistema
// de reset (systems/quests.ts).
export const HOUR_MS = 60 * 60 * 1000;
export const DAY_MS = 24 * HOUR_MS;
export const WEEK_MS = 7 * DAY_MS;

// Catálogo de missões do jogo. Estático — o progresso de cada jogador
// vive em QuestLog (types/Quest.ts), nunca aqui.
export const QUEST_CATALOG: QuestDefinition[] = [
  // ---------------- DIÁRIAS ----------------
  {
    id: "daily-tres-expedicoes",
    name: "Rotina do Aventureiro",
    description: "Complete 3 expedições hoje.",
    category: "DAILY",
    objective: { type: "COMPLETE_EXPEDITIONS", target: 3 },
    reward: { xp: 30, gold: 15 },
  },
  {
    id: "daily-boss-patrocinado",
    name: "Oportunidade do Dia",
    description: "Derrote 1 chefe patrocinado hoje.",
    category: "DAILY",
    objective: { type: "DEFEAT_SPONSORED_BOSS", target: 1 },
    reward: { xp: 50, gold: 25 },
  },

  // ---------------- SEMANAIS ----------------
  {
    id: "weekly-quinze-expedicoes",
    name: "Semana Cheia",
    description: "Complete 15 expedições nesta semana.",
    category: "WEEKLY",
    objective: { type: "COMPLETE_EXPEDITIONS", target: 15 },
    reward: { xp: 200, gold: 100 },
  },
  {
    id: "weekly-tres-bosses",
    name: "Terror dos Patrocinadores",
    description: "Derrote 3 chefes patrocinados nesta semana.",
    category: "WEEKLY",
    objective: { type: "DEFEAT_SPONSORED_BOSS", target: 3 },
    reward: { xp: 300, gold: 150 },
  },

  // ---------------- CONQUISTAS (permanentes) ----------------
  {
    id: "achievement-primeiro-sangue",
    name: "Primeiro Sangue",
    description: "Derrote seu primeiro chefe patrocinado.",
    category: "ACHIEVEMENT",
    objective: { type: "DEFEAT_SPONSORED_BOSS", target: 1 },
    reward: { gold: 50 },
  },
  {
    id: "achievement-veterano",
    name: "Veterano",
    description: "Alcance o nível 10.",
    category: "ACHIEVEMENT",
    objective: { type: "REACH_LEVEL", target: 10 },
    reward: { equipmentDefinitionId: "escudo-de-granito" },
  },
  {
    id: "achievement-mestre-do-cajado",
    name: "Mestre do Cajado",
    description: "Alcance maestria nível 5 com cajados.",
    category: "ACHIEVEMENT",
    objective: { type: "REACH_MASTERY_LEVEL", target: 5, weaponCategory: "cajado" },
    reward: { xp: 150 },
    requirements: { minLevel: 5 },
  },
  {
    id: "achievement-colecionador-epico",
    name: "Colecionador",
    description: "Equipe um item de raridade Épica.",
    category: "ACHIEVEMENT",
    objective: { type: "EQUIP_RARITY", target: 1, rarity: "Épico" },
    reward: { gold: 80 },
  },

  // ---------------- EVENTO TEMPORÁRIO ----------------
  {
    id: "event-blockchain-rio-2026",
    name: "Convocação Blockchain Rio",
    description: "Complete 5 expedições durante o evento Blockchain Rio 2026.",
    category: "EVENT",
    objective: { type: "COMPLETE_EXPEDITIONS", target: 5 },
    reward: { xp: 500, gold: 200, equipmentDefinitionId: "cajado-das-estrelas" },
    // TODO(backend): estas datas devem ser configuráveis no servidor,
    // não fixas no catálogo do cliente.
    availableFrom: Date.parse("2026-08-12T00:00:00-03:00"),
    availableUntil: Date.parse("2026-08-13T23:59:59-03:00"),
  },
];

export function getQuestDefinition(id: string): QuestDefinition | undefined {
  return QUEST_CATALOG.find((quest) => quest.id === id);
}
