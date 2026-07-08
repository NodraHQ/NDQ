import { useMemo, useState } from "react";
import "./Inventory.css";
import ItemCard from "./ItemCard";
import ItemDetailPanel from "./ItemDetailPanel";
import InventoryFilters, { type SlotFilter, type SortMode } from "./InventoryFilters";
import Button from "../../components/Button/Button";
import { usePlayer } from "../../state/PlayerContext";
import { canEquip } from "../../systems/equipment";
import { minLevelForTier, getEquipmentDefinition } from "../../data/equipment";
import type { EquipmentDefinition, EquipmentInstance } from "../../types/Equipment";

type InventoryProps = {
  onBack: () => void;
};

type EnrichedItem = {
  instance: EquipmentInstance;
  definition: EquipmentDefinition;
};

export default function Inventory({ onBack }: InventoryProps) {
  const { player, equipItem, unequipSlot } = usePlayer();
  const [selectedInstanceId, setSelectedInstanceId] = useState<string | null>(null);
  const [slotFilter, setSlotFilter] = useState<SlotFilter>("all");
  const [sortMode, setSortMode] = useState<SortMode>("tier");

  // Junta cada instância à sua definição do catálogo. Instâncias cuja
  // definição não existe mais (não deveria acontecer, mas dados velhos
  // ou um catálogo que mudou podem causar isso) são ignoradas aqui em
  // vez de quebrar a tela.
  const enrichedItems: EnrichedItem[] = useMemo(() => {
    return player.inventory
      .map((instance) => {
        const definition = getEquipmentDefinition(instance.definitionId);
        return definition ? { instance, definition } : null;
      })
      .filter((item): item is EnrichedItem => item !== null);
  }, [player.inventory]);

  const filteredItems = useMemo(() => {
    const filtered =
      slotFilter === "all" ? enrichedItems : enrichedItems.filter((item) => item.definition.slot === slotFilter);

    const sorted = [...filtered].sort((a, b) => {
      if (sortMode === "tier") return b.definition.tier - a.definition.tier;
      return b.instance.obtainedAt - a.instance.obtainedAt;
    });

    return sorted;
  }, [enrichedItems, slotFilter, sortMode]);

  const selected = selectedInstanceId
    ? enrichedItems.find((item) => item.instance.instanceId === selectedInstanceId) ?? null
    : null;

  function isEquipped(instanceId: string): boolean {
    return player.equippedWeaponId === instanceId || player.equippedArmorId === instanceId;
  }

  function handleEquip(instanceId: string) {
    equipItem(instanceId);
  }

  function handleUnequip(slot: "weapon" | "armor") {
    unequipSlot(slot);
  }

  return (
    <div className="inventory-screen">
      <div className="inventory-screen__header">
        <h2>Inventário</h2>
        <Button onClick={onBack}>Voltar</Button>
      </div>

      <InventoryFilters
        slotFilter={slotFilter}
        onSlotFilterChange={setSlotFilter}
        sortMode={sortMode}
        onSortModeChange={setSortMode}
        itemCount={filteredItems.length}
      />

      <div className="inventory-screen__body">
        {filteredItems.length === 0 ? (
          <p className="inventory-screen__empty">
            Nenhum item ainda. Equipamentos vêm de drops em expedição, chefes patrocinados, eventos especiais ou do
            NPC básico.
          </p>
        ) : (
          <div className="inventory-screen__grid">
            {filteredItems.map(({ instance, definition }) => (
              <ItemCard
                key={instance.instanceId}
                instance={instance}
                definition={definition}
                isEquipped={isEquipped(instance.instanceId)}
                isSelected={instance.instanceId === selectedInstanceId}
                canEquipNow={canEquip(player, instance.instanceId).ok}
                onSelect={setSelectedInstanceId}
              />
            ))}
          </div>
        )}

        {selected && (
          <ItemDetailPanel
            instance={selected.instance}
            definition={selected.definition}
            isEquipped={isEquipped(selected.instance.instanceId)}
            requiredLevel={minLevelForTier(selected.definition.tier)}
            playerLevel={player.level}
            equipCheck={canEquip(player, selected.instance.instanceId)}
            onEquip={() => handleEquip(selected.instance.instanceId)}
            onUnequip={() => handleUnequip(selected.definition.slot)}
            onClose={() => setSelectedInstanceId(null)}
          />
        )}
      </div>
    </div>
  );
}
