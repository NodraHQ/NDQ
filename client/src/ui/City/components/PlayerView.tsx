import "./PlayerView.css";

import { player } from "../../../services/player";

export default function PlayerView() {
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
          <strong>Classe:</strong> {player.className}
        </p>

        <p>
          <strong>Espada:</strong> {player.weapon}
        </p>

        <p>
          <strong>Armadura:</strong> {player.armor}
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
}git add .

git commit -m "feat(player): create player model"

git push