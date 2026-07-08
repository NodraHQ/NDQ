import { createContext, useContext, useState, type ReactNode } from "react";
import type { QuestEvent, QuestLog, QuestReward } from "../types/Quest";
import {
  initializeQuestLog,
  applyQuestEvent as applyQuestEventSystem,
  claimQuestReward as claimQuestRewardSystem,
  evaluateQuestUnlocks as evaluateQuestUnlocksSystem,
  resetExpiredQuests as resetExpiredQuestsSystem,
} from "../systems/quests";

type QuestContextValue = {
  questLog: QuestLog;
  /** Chamar sempre que uma ação relevante do jogo acontecer (ver types/Quest.ts). */
  reportEvent: (event: QuestEvent) => void;
  /** Reavalia LOCKED -> AVAILABLE — chamar depois de um level up. */
  refreshUnlocks: (playerLevel: number) => void;
  /** Reseta diárias/semanais expiradas — chamar ao abrir o app/hub. */
  refreshCycles: (playerLevel: number) => void;
  /**
   * Resgata a recompensa de uma missão COMPLETED. Retorna a recompensa
   * pra quem chamou aplicar via usePlayer() (addRewards / receiveEquipmentDrop)
   * — este contexto não conhece o Player, de propósito.
   */
  claimReward: (questId: string) => QuestReward | null;
};

const QuestContext = createContext<QuestContextValue | null>(null);

// NOTA: este provider ainda não está montado em main.tsx/App.tsx — não
// existe tela consumindo missões nesta sprint (só domínio + estado,
// como pedido). Montar <QuestProvider> na árvore é trabalho da sprint
// que adicionar a interface de missões.
//
// TODO(backend): assim como o PlayerProvider, este estado hoje só vive
// no navegador. Login real precisa hidratar o QuestLog a partir da API.
export function QuestProvider({ children, initialPlayerLevel = 1 }: { children: ReactNode; initialPlayerLevel?: number }) {
  const [questLog, setQuestLog] = useState<QuestLog>(() => initializeQuestLog(initialPlayerLevel));

  function reportEvent(event: QuestEvent) {
    setQuestLog((prev) => applyQuestEventSystem(prev, event));
  }

  function refreshUnlocks(playerLevel: number) {
    setQuestLog((prev) => evaluateQuestUnlocksSystem(prev, playerLevel));
  }

  function refreshCycles(playerLevel: number) {
    setQuestLog((prev) => resetExpiredQuestsSystem(prev, playerLevel));
  }

  function claimReward(questId: string): QuestReward | null {
    const result = claimQuestRewardSystem(questLog, questId);
    if (!result) return null;
    setQuestLog(result.questLog);
    return result.reward;
  }

  return (
    <QuestContext.Provider value={{ questLog, reportEvent, refreshUnlocks, refreshCycles, claimReward }}>
      {children}
    </QuestContext.Provider>
  );
}

export function useQuestLog() {
  const ctx = useContext(QuestContext);
  if (!ctx) throw new Error("useQuestLog precisa estar dentro de um <QuestProvider>");
  return ctx;
}
