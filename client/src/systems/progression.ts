import type { Player } from "../types/Player";
import { TIER_LEVEL_REQUIREMENTS } from "../data/equipment";

// Curva de XP do personagem: cada nível pede ~25% a mais de XP que o
// anterior. Ajustável num único lugar.
export function xpRequiredForLevel(level: number, base = 100): number {
  return Math.round(base * Math.pow(1.25, level - 1));
}

// Qual o maior tier de equipamento que este nível já desbloqueia.
// Única fonte de verdade: TIER_LEVEL_REQUIREMENTS (data/equipment.ts).
// TODO(backend): replicar/validar esta regra no servidor também —
// o cliente nunca deve ser a única checagem de autorização pra equipar.
export function unlockedTier(level: number): number {
  let unlocked = 1;
  for (const [tierStr, minLevel] of Object.entries(TIER_LEVEL_REQUIREMENTS)) {
    const tier = Number(tierStr);
    if (level >= minLevel && tier > unlocked) unlocked = tier;
  }
  return unlocked;
}

// Aplica ganho de XP ao personagem, processando múltiplas subidas de
// nível se necessário (ex: um chefe patrocinado dá XP suficiente pra
// subir 2 níveis de uma vez). Função pura — não muta o Player recebido.
export function addXp(player: Player, amount: number): Player {
  if (amount <= 0) return player;

  let level = player.level;
  let xp = player.xp + amount;
  let xpToNext = player.xpToNext;
  let maxHp = player.maxHp;
  let leveledUp = false;

  while (xp >= xpToNext) {
    xp -= xpToNext;
    level += 1;
    xpToNext = xpRequiredForLevel(level);
    maxHp += 10; // TODO: mover ganho de stats por nível pra uma tabela própria quando houver mais atributos
    leveledUp = true;
  }

  return {
    ...player,
    level,
    xp,
    xpToNext,
    maxHp,
    // Subir de nível cura o personagem por completo.
    hp: leveledUp ? maxHp : player.hp,
  };
}
