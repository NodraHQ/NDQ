import type { MasteryState, Player } from "../types/Player";
import type { WeaponCategory } from "../types/Equipment";

const MASTERY_CATEGORIES: WeaponCategory[] = ["espada", "cajado", "arco", "machado", "adaga"];

export function createInitialMasteries(): Record<WeaponCategory, MasteryState> {
  const masteries = {} as Record<WeaponCategory, MasteryState>;
  for (const category of MASTERY_CATEGORIES) {
    masteries[category] = { level: 1, xp: 0, xpToNext: masteryXpRequired(1) };
  }
  return masteries;
}

export function masteryXpRequired(level: number, base = 50): number {
  return Math.round(base * Math.pow(1.2, level - 1));
}

// Ganha XP de maestria numa categoria específica de arma. Evolui
// independente do nível do personagem — dois jogadores no mesmo nível
// podem ter maestrias bem diferentes dependendo do que usaram mais.
// Função pura — não muta o Player recebido.
export function addMasteryXp(player: Player, category: WeaponCategory, amount: number): Player {
  if (amount <= 0) return player;

  const current = player.masteries[category];
  let level = current.level;
  let xp = current.xp + amount;
  let xpToNext = current.xpToNext;

  while (xp >= xpToNext) {
    xp -= xpToNext;
    level += 1;
    xpToNext = masteryXpRequired(level);
  }

  return {
    ...player,
    masteries: {
      ...player.masteries,
      [category]: { level, xp, xpToNext },
    },
  };
}
