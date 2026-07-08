import type {
  QuestDefinition,
  QuestEvent,
  QuestLog,
  QuestObjectiveType,
  QuestReward,
  QuestState,
} from "../types/Quest";
import { QUEST_CATALOG, getQuestDefinition, DAY_MS, WEEK_MS } from "../data/quests";

// Objetivos de "patamar" guardam o maior valor já alcançado (ex: nível
// atingido, nível de maestria) em vez de somar ocorrências. Todo o
// resto é contador cumulativo (expedições completas, gold ganho...).
const THRESHOLD_OBJECTIVES: ReadonlySet<QuestObjectiveType> = new Set([
  "REACH_LEVEL",
  "REACH_MASTERY_LEVEL",
]);

function isThresholdObjective(type: QuestObjectiveType): boolean {
  return THRESHOLD_OBJECTIVES.has(type);
}

function initialStateFor(definition: QuestDefinition, playerLevel: number): QuestState {
  const minLevel = definition.requirements?.minLevel ?? 0;
  return playerLevel >= minLevel ? "AVAILABLE" : "LOCKED";
}

// ACHIEVEMENT e EVENT não usam ciclo de reset automático — conquistas
// são permanentes, e eventos têm janela fixa (availableFrom/Until).
function cycleEndFor(category: QuestDefinition["category"], now: number): number | undefined {
  if (category === "DAILY") return now + DAY_MS;
  if (category === "WEEKLY") return now + WEEK_MS;
  return undefined;
}

function isWithinEventWindow(definition: QuestDefinition, now: number): boolean {
  if (definition.category !== "EVENT") return true;
  const afterStart = definition.availableFrom === undefined || now >= definition.availableFrom;
  const beforeEnd = definition.availableUntil === undefined || now <= definition.availableUntil;
  return afterStart && beforeEnd;
}

// Cria o QuestLog inicial de um jogador novo, avaliando LOCKED/AVAILABLE
// a partir do nível atual.
export function initializeQuestLog(playerLevel: number, now: number = Date.now()): QuestLog {
  const log: QuestLog = {};
  for (const definition of QUEST_CATALOG) {
    log[definition.id] = {
      questId: definition.id,
      state: initialStateFor(definition, playerLevel),
      progress: 0,
      cycleEndsAt: cycleEndFor(definition.category, now),
    };
  }
  return log;
}

// Reavalia missões LOCKED contra o nível atual (chamar depois de um
// level up). Missões que já saíram de LOCKED nunca voltam pra lá.
export function evaluateQuestUnlocks(questLog: QuestLog, playerLevel: number): QuestLog {
  let changed = false;
  const next: QuestLog = { ...questLog };

  for (const definition of QUEST_CATALOG) {
    const current = next[definition.id];
    if (!current || current.state !== "LOCKED") continue;

    const minLevel = definition.requirements?.minLevel ?? 0;
    if (playerLevel >= minLevel) {
      next[definition.id] = { ...current, state: "AVAILABLE" };
      changed = true;
    }
  }

  return changed ? next : questLog;
}

// Traduz um evento de domínio num incremento de progresso para uma
// missão específica — ou null se o evento não afeta essa missão.
// Para objetivos de patamar (REACH_LEVEL, REACH_MASTERY_LEVEL) o valor
// retornado é o valor absoluto atingido, não um incremento.
function objectiveDelta(definition: QuestDefinition, event: QuestEvent): number | null {
  const { objective } = definition;

  switch (event.type) {
    case "EXPEDITION_COMPLETED":
      return objective.type === "COMPLETE_EXPEDITIONS" ? 1 : null;

    case "SPONSORED_BOSS_DEFEATED":
      if (objective.type === "DEFEAT_SPONSORED_BOSS") return 1;
      if (objective.type === "DEFEAT_SPECIFIC_BOSS" && objective.bossName === event.bossName) return 1;
      return null;

    case "GOLD_EARNED":
      return objective.type === "EARN_GOLD" ? event.amount : null;

    case "EQUIPMENT_EQUIPPED":
      return objective.type === "EQUIP_RARITY" && objective.rarity === event.rarity ? 1 : null;

    case "LEVEL_REACHED":
      return objective.type === "REACH_LEVEL" ? event.level : null;

    case "MASTERY_LEVEL_REACHED":
      return objective.type === "REACH_MASTERY_LEVEL" && objective.weaponCategory === event.category
        ? event.level
        : null;

    default:
      return null;
  }
}

// Aplica um evento de domínio a todas as missões afetadas do catálogo.
// Só o sistema de missões conhece este evento — quem dispara (batalha,
// expedição, progressão) não precisa saber que missões existem.
export function applyQuestEvent(questLog: QuestLog, event: QuestEvent, now: number = Date.now()): QuestLog {
  let changed = false;
  const next: QuestLog = { ...questLog };

  for (const definition of QUEST_CATALOG) {
    const current = next[definition.id];
    if (!current) continue;
    if (current.state === "LOCKED" || current.state === "COMPLETED" || current.state === "CLAIMED") continue;
    if (!isWithinEventWindow(definition, now)) continue;

    const delta = objectiveDelta(definition, event);
    if (delta === null) continue;

    const newProgress = isThresholdObjective(definition.objective.type)
      ? Math.max(current.progress, delta)
      : current.progress + delta;

    const completed = newProgress >= definition.objective.target;

    next[definition.id] = {
      ...current,
      progress: newProgress,
      state: completed ? "COMPLETED" : "IN_PROGRESS",
    };
    changed = true;
  }

  return changed ? next : questLog;
}

// Resgata a recompensa de uma missão COMPLETED, movendo-a para CLAIMED.
// Retorna a recompensa pra quem chamou aplicar (xp/gold via
// systems/progression.ts, item via systems/equipment.ts) — este sistema
// não conhece o Player, de propósito, pra não acoplar os dois domínios.
export function claimQuestReward(
  questLog: QuestLog,
  questId: string
): { questLog: QuestLog; reward: QuestReward } | null {
  const current = questLog[questId];
  if (!current || current.state !== "COMPLETED") return null;

  const definition = getQuestDefinition(questId);
  if (!definition) return null;

  return {
    questLog: { ...questLog, [questId]: { ...current, state: "CLAIMED" } },
    reward: definition.reward,
  };
}

// Reseta missões DIÁRIAS/SEMANAIS cujo ciclo já expirou, recomeçando o
// progresso e reavaliando LOCKED/AVAILABLE contra o nível atual.
// TODO(backend): isso precisa ser autoritativo no servidor (ex: um job
// agendado), e não depender do cliente chamar esta função na hora certa
// — senão dá pra "trapacear" atrasando o relógio do dispositivo.
export function resetExpiredQuests(questLog: QuestLog, playerLevel: number, now: number = Date.now()): QuestLog {
  let changed = false;
  const next: QuestLog = { ...questLog };

  for (const definition of QUEST_CATALOG) {
    if (definition.category !== "DAILY" && definition.category !== "WEEKLY") continue;

    const current = next[definition.id];
    if (!current?.cycleEndsAt || now < current.cycleEndsAt) continue;

    next[definition.id] = {
      questId: definition.id,
      state: initialStateFor(definition, playerLevel),
      progress: 0,
      cycleEndsAt: cycleEndFor(definition.category, now),
    };
    changed = true;
  }

  return changed ? next : questLog;
}
