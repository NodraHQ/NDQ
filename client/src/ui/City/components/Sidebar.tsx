import "./Sidebar.css";

import Button from "../../../components/Button/Button";

export default function Sidebar() {
  return (
    <aside className="sidebar">

      <Button>🌲 Explorar</Button>

      <Button>🎒 Inventário</Button>

      <Button>🛒 Mercado</Button>

      <Button>⚔ Bosses</Button>

      <Button>👥 Guilda</Button>

      <Button>📜 Missões</Button>

      <Button>⚙ Configurações</Button>

    </aside>
  );
}