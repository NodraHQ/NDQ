import { useState } from "react";
import "./Battle.css";
import PixelSprite from "./PixelSprite";
import { drawHero, BOSS_DRAWERS } from "./pixelArt";
import { usePlayer } from "../../state/PlayerContext";
import type { SponsoredBoss } from "../../data/dungeons";

type BattleProps = {
  boss: SponsoredBoss;
  onFinish: (result: "victory" | "defeat" | "fled") => void;
};

export default function Battle({ boss, onFinish }: BattleProps) {
  const { player, applyDamage, addRewards, receiveEquipmentDrop, gainMasteryForEquippedWeapon } = usePlayer();
  const [bossHp, setBossHp] = useState(boss.hp);
  const [message, setMessage] = useState(`${boss.name} apareceu! O que você vai fazer?`);
  const [busy, setBusy] = useState(false);
  const [skillCd, setSkillCd] = useState(0);
  const [shakeBoss, setShakeBoss] = useState(false);
  const [shakeHero, setShakeHero] = useState(false);

  const drawBoss = BOSS_DRAWERS[boss.name] ?? BOSS_DRAWERS["Golem de Pedra Antiga"];

  function flashBoss() {
    setShakeBoss(true);
    setTimeout(() => setShakeBoss(false), 350);
  }
  function flashHero() {
    setShakeHero(true);
    setTimeout(() => setShakeHero(false), 350);
  }

  function bossTurn(playerDefending: boolean) {
    let dmg = boss.atk + Math.floor(Math.random() * 5);
    if (playerDefending) dmg = Math.max(1, Math.round(dmg * 0.4));
    const newHp = Math.max(0, player.hp - dmg);
    applyDamage(dmg);
    flashHero();
    setMessage(`${boss.name} contra-ataca! ${dmg} de dano${playerDefending ? " (reduzido pela defesa)" : ""}.`);
    setSkillCd((cd) => Math.max(0, cd - 1));

    if (newHp <= 0) {
      setTimeout(() => onFinish("defeat"), 700);
      return;
    }
    setTimeout(() => {
      setBusy(false);
      setMessage("O que você vai fazer?");
    }, 900);
  }

  function act(kind: "attack" | "skill" | "defend" | "flee") {
    if (busy) return;
    setBusy(true);

    if (kind === "flee") {
      setMessage("Você foge da batalha...");
      setTimeout(() => onFinish("fled"), 800);
      return;
    }

    let dmg = 0;
    if (kind === "attack") {
      dmg = player.level * 2 + 6 + Math.floor(Math.random() * 5);
      setMessage(`Você ataca! ${dmg} de dano.`);
    } else if (kind === "skill") {
      dmg = Math.round((player.level * 2 + 6) * 1.8) + Math.floor(Math.random() * 6);
      setMessage(`Você usa GOLPE ESTELAR! ${dmg} de dano crítico!`);
      setSkillCd(3);
    } else if (kind === "defend") {
      setMessage("Você se prepara para defender o próximo golpe.");
    }

    if (dmg > 0) {
      const newBossHp = Math.max(0, bossHp - dmg);
      setBossHp(newBossHp);
      flashBoss();
      if (newBossHp <= 0) {
        setTimeout(() => {
          addRewards({ xp: boss.xp, gold: boss.gold });
          receiveEquipmentDrop(boss.lootDefinitionId);
          // Vitória contra chefe patrocinado também evolui a maestria da
          // arma que o jogador está usando agora.
          gainMasteryForEquippedWeapon(20);
          onFinish("victory");
        }, 700);
        return;
      }
    }

    setTimeout(() => bossTurn(kind === "defend"), 1100);
  }

  return (
    <div className="battle-screen">
      <div className="battlefield">
        <div className="boss-side">
          <div className="name-tag">{boss.name.toUpperCase()}</div>
          <div className="hp-wrap">
            <div className="bar-track"><div className="bar-fill" style={{ width: `${(bossHp / boss.hp) * 100}%` }} /></div>
          </div>
          <div className="platform" />
          <div className={shakeBoss ? "shake" : ""}>
            <PixelSprite draw={(ctx, size) => drawBoss(ctx, size)} size={40} displaySize={118} />
          </div>
        </div>
        <div className="hero-side">
          <div className="name-tag">{player.username.toUpperCase()} · NV.{player.level}</div>
          <div className="hp-wrap">
            <div className="bar-track"><div className="bar-fill" style={{ width: `${(player.hp / player.maxHp) * 100}%` }} /></div>
          </div>
          <div className="platform" />
          <div className={shakeHero ? "shake" : ""}>
            <PixelSprite draw={drawHero} size={32} displaySize={92} />
          </div>
        </div>
      </div>

      <div className="battle-box">{message}</div>

      <div className="action-menu">
        <button className="action-btn" disabled={busy} onClick={() => act("attack")}>
          ⚔ ATACAR<span className="sub">Golpe básico</span>
        </button>
        <button className="action-btn" disabled={busy || skillCd > 0} onClick={() => act("skill")}>
          ✦ HABILIDADE<span className="sub">{skillCd > 0 ? `Recarregando (${skillCd})` : "Dano maior"}</span>
        </button>
        <button className="action-btn" disabled={busy} onClick={() => act("defend")}>
          🛡 DEFENDER<span className="sub">Reduz dano recebido</span>
        </button>
        <button className="action-btn" disabled={busy} onClick={() => act("flee")}>
          ➜ FUGIR<span className="sub">Sai da batalha</span>
        </button>
      </div>
    </div>
  );
}
