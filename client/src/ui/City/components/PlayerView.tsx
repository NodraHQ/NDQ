import "./PlayerView.css";

import { usePlayer } from "../../../state/PlayerContext";

export default function PlayerView() {
  const { player, getEquippedWeapon, getEquippedArmor } = usePlayer();
  const weapon = getEquippedWeapon();
  const armor = getEquippedArmor();
  return (
    <section className="player-view">
      <div className="character">
        <div className="character-body" />
      </div>

      <div className="equipment">

        <h2>{player.username}</h2>

        <p>
          <strong>Nível:</strong> {player.level}
        </p>

        <p>
          <strong>HP:</strong> {player.hp} / {player.maxHp}
        </p>

        <p>
          <strong>XP:</strong> {player.xp} / {player.xpToNext}
        </p>

        <p>
          <strong>Classe:</strong> {player.class}
        </p>

        <p>
          <strong>Arma:</strong> {weapon?.name ?? "Nenhuma"}
        </p>

        <p>
          <strong>Armadura:</strong> {armor?.name ?? "Nenhuma"}
        </p>

        <p>
          <strong>Ouro:</strong> {player.gold}
        </p>

        <p>
          <strong>ND:</strong> {player.nd}
        </p>

      </div>
    </section>
  );
}