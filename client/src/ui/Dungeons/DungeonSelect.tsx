import "./DungeonSelect.css";
import { DUNGEONS, type Dungeon } from "../../data/dungeons";
import Button from "../../components/Button/Button";

type DungeonSelectProps = {
  onSelect: (dungeon: Dungeon) => void;
  onBack: () => void;
};

export default function DungeonSelect({ onSelect, onBack }: DungeonSelectProps) {
  return (
    <div className="dungeon-select">
      <div className="dungeon-select-header">
        <h2>Escolha uma masmorra</h2>
        <p>Seu personagem parte sozinho. Volte depois para ver o resultado — ou fique de olho em um chefe patrocinado raro.</p>
      </div>

      <div className="dungeon-grid">
        {DUNGEONS.map((d) => (
          <button key={d.id} className="dungeon-card" style={{ borderColor: d.color }} onClick={() => onSelect(d)}>
            <div className="dungeon-icon" style={{ background: d.color }} />
            <div className="dungeon-info">
              <h3>{d.name}</h3>
              <p>{d.description}</p>
              <span className="dungeon-meta">
                ⏱ {Math.round(d.durationMs / 1000)}s · chance rara de chefe patrocinado
              </span>
            </div>
          </button>
        ))}
      </div>

      <Button onClick={onBack}>Voltar</Button>
    </div>
  );
}
