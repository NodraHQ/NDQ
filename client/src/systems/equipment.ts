import type { Player } from "../types/Player";
import type { EquipmentInstance, EquipmentDefinition } from "../types/Equipment";
import { WEAPON_CATEGORY_TO_CLASS } from "../types/Equipment";
import { getEquipmentDefinition, minLevelForTier } from "../data/equipment";

function generateInstanceId(): string {
  // TODO(backend): substituir por um id emitido/validado pelo servidor
  // e, mais adiante, pelo identificador do NFT do item na Stellar. Isso
  // aqui é só um id local, suficiente pro estado do cliente por enquanto.
  return `inst_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

// Adiciona um equipamento ao inventário do jogador.
//
// Regra imutável: equipamentos só entram no jogo por drop. Não existe
// (propositalmente) nenhuma função de comprar um EquipmentDefinition
// direto do catálogo — só esta, chamada a partir do resultado de uma
// expedição ou de uma vitória contra chefe patrocinado.
export function receiveEquipmentDrop(player: Player, definitionId: string): Player {
  const definition = getEquipmentDefinition(definitionId);
  if (!definition) {
    console.warn(`[equipment] Definição desconhecida: ${definitionId}`);
    return player;
  }

  const instance: EquipmentInstance = {
    instanceId: generateInstanceId(),
    definitionId,
    obtainedAt: Date.now(),
    broken: false,
  };

  return { ...player, inventory: [...player.inventory, instance] };
}

export type EquipCheck = { ok: true } | { ok: false; reason: string };

// Verifica se um item do inventário pode ser equipado agora (existe,
// não está quebrado, e o nível do personagem já desbloqueou o tier).
export function canEquip(player: Player, instanceId: string): EquipCheck {
  const instance = player.inventory.find((i) => i.instanceId === instanceId);
  if (!instance) return { ok: false, reason: "Item não encontrado no inventário." };
  if (instance.broken) return { ok: false, reason: "Este item está destruído." };

  const definition = getEquipmentDefinition(instance.definitionId);
  if (!definition) return { ok: false, reason: "Definição de equipamento desconhecida." };

  const requiredLevel = minLevelForTier(definition.tier);
  if (player.level < requiredLevel) {
    return { ok: false, reason: `Requer nível ${requiredLevel} (tier ${definition.tier}).` };
  }

  if (definition.requiredMastery) {
    const { category, level } = definition.requiredMastery;
    const currentMasteryLevel = player.masteries[category].level;
    if (currentMasteryLevel < level) {
      return { ok: false, reason: `Requer maestria ${level} em ${category} (atual: ${currentMasteryLevel}).` };
    }
  }

  return { ok: true };
}

// Equipa um item do inventário no slot correspondente. Quando o item é
// uma arma, a classe do personagem é recalculada automaticamente a
// partir da categoria da arma — nunca é escolhida manualmente.
export function equipItem(player: Player, instanceId: string): Player {
  const check = canEquip(player, instanceId);
  if (!check.ok) {
    console.warn(`[equipment] Não foi possível equipar: ${check.reason}`);
    return player;
  }

  const instance = player.inventory.find((i) => i.instanceId === instanceId)!;
  const definition = getEquipmentDefinition(instance.definitionId)!;

  if (definition.slot === "weapon") {
    const newClass = definition.category ? WEAPON_CATEGORY_TO_CLASS[definition.category] : player.class;
    return { ...player, equippedWeaponId: instanceId, class: newClass };
  }

  return { ...player, equippedArmorId: instanceId };
}

export function unequipSlot(player: Player, slot: "weapon" | "armor"): Player {
  if (slot === "weapon") {
    return { ...player, equippedWeaponId: null, class: "Sem Classe" };
  }
  return { ...player, equippedArmorId: null };
}

// Destrói uma instância de equipamento (ex: quebra numa expedição). Se
// o item destruído estava equipado, o slot correspondente é esvaziado
// automaticamente — e a classe volta a "Sem Classe" se era a arma.
export function destroyEquipmentInstance(player: Player, instanceId: string): Player {
  const wasWeapon = player.equippedWeaponId === instanceId;
  const wasArmor = player.equippedArmorId === instanceId;

  return {
    ...player,
    inventory: player.inventory.filter((i) => i.instanceId !== instanceId),
    equippedWeaponId: wasWeapon ? null : player.equippedWeaponId,
    equippedArmorId: wasArmor ? null : player.equippedArmorId,
    class: wasWeapon ? "Sem Classe" : player.class,
  };
}

// Sorteia, pra cada item equipado, uma chance de ele se destruir ao
// final de uma expedição.
// TODO(backend): este sorteio deve vir do resultado da expedição
// calculado no servidor, não ser rodado no cliente.
export function rollExpeditionDurabilityLoss(player: Player, chance = 0.05): Player {
  const equippedIds = [player.equippedWeaponId, player.equippedArmorId].filter(
    (id): id is string => id !== null
  );

  return equippedIds.reduce((current, id) => {
    return Math.random() < chance ? destroyEquipmentInstance(current, id) : current;
  }, player);
}

// Helpers de leitura, úteis pra qualquer tela que precise mostrar o
// que está equipado sem repetir a busca no inventário.
export function getEquippedDefinition(player: Player, slot: "weapon" | "armor"): EquipmentDefinition | null {
  const instanceId = slot === "weapon" ? player.equippedWeaponId : player.equippedArmorId;
  if (!instanceId) return null;
  const instance = player.inventory.find((i) => i.instanceId === instanceId);
  if (!instance) return null;
  return getEquipmentDefinition(instance.definitionId) ?? null;
}
