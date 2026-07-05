import "./City.css";

import Sidebar from "./components/Sidebar";
import PlayerView from "./components/PlayerView";

export default function City() {
  return (
    <div className="city">

      <Sidebar />

      <PlayerView />

    </div>
  );
}