import { memo } from "react";
import "./ItemCard.css";
import PixelSprite from "../Battle/PixelSprite";
import { drawChest } from "../Battle/pixelArt";
import { RARITY_COLORS } from "./displayConstants";
import type { EquipmentDefinition, EquipmentInstance } from "../../types/Equipment";

type ItemCardProps = {
  instance: EquipmentInstance;
  definition: EquipmentDefinition;
  isEquipped: boolean;
  isSelected: boolean;
  canEquipNow: boolean;
  onSelect: (instanceId: string) => void;
};

function ItemCard({ instance, definition, isEquipped, isSelected, canEquipNow, onSelect }: ItemCardProps) {
  const color = RARITY_COLORS[definition.rarity];

  return (
    <button
      className={`item-card ${isSelected ? "item-card--selected" : ""} ${isEquipped ? "item-card--equipped" : ""}`}
      style={{ borderColor: color }}
      onClick={() => onSelect(instance.instanceId)}
    >
      {isEquipped && <span className="item-card__equipped-badge">Equipado</span>}
      {instance.broken && <span className="item-card__broken-badge">Quebrado</span>}
      {!instance.broken && !canEquipNow && !isEquipped && <span className="item-card__locked-badge">🔒</span>}

      <PixelSprite draw={(ctx, size) => drawChest(ctx, size, color)} size={16} displaySize={56} />

      <span className="item-card__name">{definition.name}</span>
      <span className="item-card__meta" style={{ color }}>
        {definition.rarity} · Tier {definition.tier}
      </span>
    </button>
  );
}

// Só reflete quando as props relevantes deste item específico mudam —
// selecionar/equipar outro item não deve re-renderizar o resto da grade.
export default memo(ItemCard);
