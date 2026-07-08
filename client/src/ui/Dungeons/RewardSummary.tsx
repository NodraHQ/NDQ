import "./RewardSummary.css";
import PixelSprite from "../Battle/PixelSprite";
import { drawChest } from "../Battle/pixelArt";

type RewardSummaryProps = {
  title: string;
  xp?: number;
  gold?: number;
  itemName?: string;
  itemRarity?: string;
  itemRarityColor?: string;
  itemStat?: string;
  note?: string;
  onContinue: () => void;
};

export default function RewardSummary({
  title,
  xp,
  gold,
  itemName,
  itemRarity,
  itemRarityColor,
  itemStat,
  note,
  onContinue,
}: RewardSummaryProps) {
  return (
    <div className="reward-summary">
      <h2>{title}</h2>

      {(xp || gold) ? (
        <div className="reward-basic">
          {xp ? <span>+{xp} XP</span> : null}
          {gold ? <span>+{gold} moedas</span> : null}
        </div>
      ) : null}

      {itemName ? (
        <div className="loot-card">
          <PixelSprite draw={(ctx, size) => drawChest(ctx, size, itemRarityColor ?? "#f4c95d")} size={16} displaySize={72} />
          {itemRarity ? (
            <div className="rarity" style={{ background: itemRarityColor ?? "#f4c95d" }}>{itemRarity.toUpperCase()}</div>
          ) : null}
          <div className="item-name">{itemName}</div>
          {itemStat ? <div className="item-stat">{itemStat}</div> : null}
        </div>
      ) : null}

      {note ? <p className="reward-note">{note}</p> : null}

      <button className="primary-btn" onClick={onContinue}>Continuar</button>
    </div>
  );
}
