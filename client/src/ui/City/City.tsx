import "./City.css";

import Sidebar from "./components/Sidebar";

export default function City() {
  return (
    <div className="city">

      <Sidebar />

      <div className="player-card">

        <div className="avatar" />

        <h2>Satou</h2>

        <p>Nível 1</p>

        <p>Classe: Nenhuma</p>

        <p>XP: 0 / 100</p>

      </div>

    </div>
  );
}