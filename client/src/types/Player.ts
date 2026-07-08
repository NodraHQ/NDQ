import type { CharacterClass, EquipmentInstance, WeaponCategory } from "./Equipment";

export type MasteryState = {
  level: number;
  xp: number;
  xpToNext: number;
};

// Regra imutável: apenas 1 personagem por conta. Este tipo representa
// esse único personagem — não existe (e não deve existir) uma lista de
// personagens em lugar nenhum do app.
export interface Player {
  id: string;
  username: string;

  level: number;
  xp: number;
  xpToNext: number;

  hp: number;
  maxHp: number;

  // Derivada exclusivamente da categoria da arma equipada.
  // "Sem Classe" enquanto equippedWeaponId for null.
  class: CharacterClass;

  inventory: EquipmentInstance[];
  equippedWeaponId: string | null; // instanceId dentro de inventory
  equippedArmorId: string | null; // instanceId dentro de inventory

  // Maestria evolui por categoria de arma, independente do nível do
  // personagem — usar mais uma categoria a torna mais forte nela.
  masteries: Record<WeaponCategory, MasteryState>;

  gold: number;
  nd: number;
}
