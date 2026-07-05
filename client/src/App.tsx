import { useEffect, useState } from "react";

import { startGame } from "./game/Game";

import Home from "./ui/Home";
import City from "./ui/City/City";

import "./ui/Home.css";
import "./ui/City/City.css";

function App() {
  const [screen, setScreen] = useState("home");

  useEffect(() => {
    const game = startGame("game");

    return () => {
      game.destroy(true);
    };
  }, []);

  return (
    <>
      <div
        id="game"
        style={{
          position: "fixed",
          inset: 0,
        }}
      />

      {screen === "home" && (
        <Home onEnter={() => setScreen("city")} />
      )}

      {screen === "city" && (
        <City />
      )}
    </>
  );
}

export default App;