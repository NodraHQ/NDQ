import { createContext, useContext, useState, type ReactNode } from "react";
import type { Player } from "../types/Player";
import type { WeaponCategory } from "../types/Equipment";
import { addXp, xpRequiredForLevel } from "../systems/progression";
import { addMasteryXp, createInitialMasteries } from "../systems/mastery";
import {
  equipItem as equipItemSystem,
  unequipSlot as unequipSlotSystem,
  receiveEquipmentDrop as receiveEquipmentDropSystem,
  destroyEquipmentInstance as destroyEquipmentInstanceSystem,
  rollExpeditionDurabilityLoss as rollExpeditionDurabilityLossSystem,
  getEquippedDefinition,
} from "../systems/equipment";

const initialPlayer: Player = {
  id: "1",
  username: "Satou",

  level: 1,
  xp: 0,
  xpToNext: xpRequiredForLevel(1),

  hp: 100,
  maxHp: 100,

  class: "Sem Classe",

  inventory: [],
  equippedWeaponId: null,
  equippedArmorId: null,

  masteries: createInitialMasteries(),

  gold: 0,
  nd: 0,
};

type PlayerContextValue = {
  player: Player;

  // Progressão
  addRewards: (opts: { xp?: number; gold?: number }) => void;
  applyDamage: (amount: number) => void;
  heal: (amount: number) => void;

  // Equipamentos
  receiveEquipmentDrop: (definitionId: string) => void;
  equipItem: (instanceId: string) => void;
  unequipSlot: (slot: "weapon" | "armor") => void;
  destroyEquipmentInstance: (instanceId: string) => void;
  rollExpeditionDurabilityLoss: () => void;
  getEquippedWeapon: () => ReturnType<typeof getEquippedDefinition>;
  getEquippedArmor: () => ReturnType<typeof getEquippedDefinition>;

  // Maestria
  gainMasteryXp: (category: WeaponCategory, amount: number) => void;
  gainMasteryForEquippedWeapon: (amount: number) => void;
};

const PlayerContext = createContext<PlayerContextValue | null>(null);

// TODO(backend): este estado hoje vive só no navegador (modo convidado,
// 100% off-chain). Quando a conta real (e-mail/senha) existir, isso deve
// ser hidratado a partir da API no login e sincronizado de volta a cada
// mudança relevante (fim de expedição, loot, dano em batalha, etc).
export function PlayerProvider({ children }: { children: ReactNode }) {
  const [player, setPlayer] = useState<Player>(initialPlayer);

  function addRewards({ xp = 0, gold = 0 }: { xp?: number; gold?: number }) {
    setPlayer((prev) => {
      const withXp = xp > 0 ? addXp(prev, xp) : prev;
      return gold > 0 ? { ...withXp, gold: withXp.gold + gold } : withXp;
    });
  }

  function applyDamage(amount: number) {
    setPlayer((prev) => ({ ...prev, hp: Math.max(0, prev.hp - amount) }));
  }

  function heal(amount: number) {
    setPlayer((prev) => ({ ...prev, hp: Math.min(prev.maxHp, prev.hp + amount) }));
  }

  function receiveEquipmentDrop(definitionId: string) {
    setPlayer((prev) => receiveEquipmentDropSystem(prev, definitionId));
  }

  function equipItem(instanceId: string) {
    setPlayer((prev) => equipItemSystem(prev, instanceId));
  }

  function unequipSlot(slot: "weapon" | "armor") {
    setPlayer((prev) => unequipSlotSystem(prev, slot));
  }

  function destroyEquipmentInstance(instanceId: string) {
    setPlayer((prev) => destroyEquipmentInstanceSystem(prev, instanceId));
  }

  function rollExpeditionDurabilityLoss() {
    setPlayer((prev) => rollExpeditionDurabilityLossSystem(prev));
  }

  function getEquippedWeapon() {
    return getEquippedDefinition(player, "weapon");
  }

  function getEquippedArmor() {
    return getEquippedDefinition(player, "armor");
  }

  function gainMasteryXp(category: WeaponCategory, amount: number) {
    setPlayer((prev) => addMasteryXp(prev, category, amount));
  }

  // Conveniência: evolui a maestria da categoria da arma que está
  // equipada agora (ex: chamado ao final de uma batalha). Não faz nada
  // se não houver arma equipada.
  function gainMasteryForEquippedWeapon(amount: number) {
    setPlayer((prev) => {
      const weapon = getEquippedDefinition(prev, "weapon");
      if (!weapon?.category) return prev;
      return addMasteryXp(prev, weapon.category, amount);
    });
  }

  return (
    <PlayerContext.Provider
      value={{
        player,
        addRewards,
        applyDamage,
        heal,
        receiveEquipmentDrop,
        equipItem,
        unequipSlot,
        destroyEquipmentInstance,
        rollExpeditionDurabilityLoss,
        getEquippedWeapon,
        getEquippedArmor,
        gainMasteryXp,
        gainMasteryForEquippedWeapon,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer precisa estar dentro de um <PlayerProvider>");
  return ctx;
}
