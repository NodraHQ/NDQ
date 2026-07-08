import "./BossEncounter.css";
import PixelSprite from "../Battle/PixelSprite";
import { BOSS_DRAWERS } from "../Battle/pixelArt";
import type { SponsoredBoss } from "../../data/dungeons";

type BossEncounterProps = {
  boss: SponsoredBoss;
  onBattle: () => void;
  onSkip: () => void;
};

export default function BossEncounter({ boss, onBattle, onSkip }: BossEncounterProps) {
  const draw = BOSS_DRAWERS[boss.name] ?? BOSS_DRAWERS["Golem de Pedra Antiga"];

  return (
    <div className="boss-encounter">
      <span className="sponsor-tag">Chefe patrocinado · {boss.sponsor}</span>
      <PixelSprite draw={draw} size={40} displaySize={140} />
      <h2>{boss.name}</h2>
      <p>Um chefe raro apareceu durante sua expedição. Batalhar pode render um item exclusivo — ou você pode seguir em frente sem arriscar.</p>
      <div className="boss-encounter-actions">
        <button className="primary-btn" onClick={onBattle}>⚔ Batalhar</button>
        <button className="secondary-btn" onClick={onSkip}>Pular</button>
      </div>
    </div>
  );
}
