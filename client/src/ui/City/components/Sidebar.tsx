import "./Sidebar.css";

import Button from "../../../components/Button/Button";

type SidebarProps = {
  onExplore: () => void;
  onOpenInventory: () => void;
};

export default function Sidebar({ onExplore, onOpenInventory }: SidebarProps) {
  return (
    <aside className="sidebar">

      <Button onClick={onExplore}>🌲 Explorar</Button>

      <Button onClick={onOpenInventory}>🎒 Inventário</Button>

      <Button>🛒 Mercado</Button>

      <Button>👥 Guilda</Button>

      <Button>📜 Missões</Button>

      <Button>⚙ Configurações</Button>

    </aside>
  );
}