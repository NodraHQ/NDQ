import "./ItemDetailPanel.css";
import PixelSprite from "../Battle/PixelSprite";
import { drawChest } from "../Battle/pixelArt";
import { RARITY_COLORS, CATEGORY_LABELS } from "./displayConstants";
import type { EquipmentDefinition, EquipmentInstance } from "../../types/Equipment";
import type { EquipCheck } from "../../systems/equipment";

type ItemDetailPanelProps = {
  instance: EquipmentInstance;
  definition: EquipmentDefinition;
  isEquipped: boolean;
  requiredLevel: number;
  playerLevel: number;
  equipCheck: EquipCheck;
  onEquip: () => void;
  onUnequip: () => void;
  onClose: () => void;
};

const STAT_LABELS: Record<string, string> = {
  atk: "Ataque",
  def: "Defesa",
  hp: "HP máximo",
};

export default function ItemDetailPanel({
  instance,
  definition,
  isEquipped,
  requiredLevel,
  playerLevel,
  equipCheck,
  onEquip,
  onUnequip,
  onClose,
}: ItemDetailPanelProps) {
  const color = RARITY_COLORS[definition.rarity];
  const levelMet = playerLevel >= requiredLevel;

  return (
    <div className="item-detail">
      <button className="item-detail__close" onClick={onClose} aria-label="Fechar">
        ✕
      </button>

      <div className="item-detail__header">
        <PixelSprite draw={(ctx, size) => drawChest(ctx, size, color)} size={16} displaySize={80} />
        <div>
          <h3>{definition.name}</h3>
          <span className="item-detail__rarity" style={{ color }}>
            {definition.rarity}
          </span>
        </div>
      </div>

      {instance.broken && <div className="item-detail__broken-notice">Este item está destruído e não pode ser equipado.</div>}

      <dl className="item-detail__facts">
        <div>
          <dt>Slot</dt>
          <dd>{definition.slot === "weapon" ? "Arma" : "Armadura"}</dd>
        </div>

        {definition.category && (
          <div>
            <dt>Categoria</dt>
            <dd>{CATEGORY_LABELS[definition.category] ?? definition.category}</dd>
          </div>
        )}

        <div>
          <dt>Tier</dt>
          <dd>{definition.tier}</dd>
        </div>

        <div>
          <dt>Nível requerido</dt>
          <dd className={levelMet ? "" : "item-detail__unmet"}>
            {requiredLevel} {!levelMet && `(você: ${playerLevel})`}
          </dd>
        </div>

        {definition.requiredMastery && (
          <div>
            <dt>Maestria requerida</dt>
            <dd>
              Nível {definition.requiredMastery.level} em {CATEGORY_LABELS[definition.requiredMastery.category]}
            </dd>
          </div>
        )}
      </dl>

      <div className="item-detail__stats">
        <h4>Atributos</h4>
        {Object.entries(definition.stats).length === 0 ? (
          <p className="item-detail__no-stats">Sem bônus de atributo.</p>
        ) : (
          <ul>
            {Object.entries(definition.stats).map(([stat, value]) => (
              <li key={stat}>
                <span>{STAT_LABELS[stat] ?? stat}</span>
                <strong>+{value}</strong>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="item-detail__action">
        {isEquipped ? (
          <button className="item-detail__btn item-detail__btn--secondary" onClick={onUnequip}>
            Desequipar
          </button>
        ) : (
          <>
            <button className="item-detail__btn" onClick={onEquip} disabled={!equipCheck.ok}>
              Equipar
            </button>
            {!equipCheck.ok && <p className="item-detail__reason">{equipCheck.reason}</p>}
          </>
        )}
      </div>
    </div>
  );
}
