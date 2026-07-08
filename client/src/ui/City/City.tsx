import "./City.css";

import Sidebar from "./components/Sidebar";
import PlayerView from "./components/PlayerView";

type CityProps = {
  onExplore: () => void;
  onOpenInventory: () => void;
};

export default function City({ onExplore, onOpenInventory }: CityProps) {
  return (
    <div className="city">

      <Sidebar onExplore={onExplore} onOpenInventory={onOpenInventory} />

      <PlayerView />

    </div>
  );
}