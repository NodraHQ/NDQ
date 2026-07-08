import { useEffect, useRef, useState } from "react";
import "./Expedition.css";
import type { Dungeon } from "../../data/dungeons";

type ExpeditionResult = {
  dungeon: Dungeon;
  bossEncountered: boolean;
};

type ExpeditionProps = {
  dungeon: Dungeon;
  onComplete: (result: ExpeditionResult) => void;
};

// TODO(backend): esta tela hoje simula o tempo todo no navegador com
// setInterval. Isso só funciona com o app aberto. Na versão real, a
// expedição precisa ser criada no backend (hora de início/fim, chefe
// sorteado no servidor) para sobreviver ao app fechado e disparar a
// notificação push quando o chefe patrocinado aparecer.
const FLAVOR_LINES = [
  "Seu personagem entra na masmorra...",
  "Corredores estreitos, tochas tremeluzindo.",
  "Um inimigo fraco aparece! Vitória automática.",
  "Você encontra moedas pelo caminho.",
  "Outro inimigo aparece! Vitória automática.",
  "Uma presença mais forte se aproxima...",
];

export default function Expedition({ dungeon, onComplete }: ExpeditionProps) {
  const [progress, setProgress] = useState(0);
  const [log, setLog] = useState<string[]>([]);
  const resolvedRef = useRef(false);

  useEffect(() => {
    resolvedRef.current = false;
    setProgress(0);
    setLog([]);

    const start = Date.now();
    const total = dungeon.durationMs;
    const lineInterval = total / (FLAVOR_LINES.length + 1);
    let nextLineIndex = 0;

    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, (elapsed / total) * 100);
      setProgress(pct);

      if (nextLineIndex < FLAVOR_LINES.length && elapsed >= lineInterval * (nextLineIndex + 1)) {
        setLog((prev) => [...prev, FLAVOR_LINES[nextLineIndex]]);
        nextLineIndex++;
      }

      if (elapsed >= total && !resolvedRef.current) {
        resolvedRef.current = true;
        clearInterval(timer);
        const bossEncountered = Math.random() < dungeon.bossChance;
        setLog((prev) => [...prev, bossEncountered ? `${dungeon.boss.name.toUpperCase()} bloqueia o caminho de volta!` : "Expedição concluída."]);
        setTimeout(() => onComplete({ dungeon, bossEncountered }), 700);
      }
    }, 120);

    return () => clearInterval(timer);
  }, [dungeon, onComplete]);

  return (
    <div className="expedition-screen">
      <h2>Explorando: {dungeon.name}</h2>
      <div className="expedition-log">
        {log.map((line, i) => (
          <div key={i}>» {line}</div>
        ))}
      </div>
      <div className="progress-outer">
        <div className="progress-inner" style={{ width: `${progress}%` }} />
      </div>
      <p className="expedition-hint">
        Nesta demo a expedição roda enquanto a tela estiver aberta. Na versão com backend, isso continua mesmo se você fechar o app.
      </p>
    </div>
  );
}
