import { useEffect } from "react";

import { startGame } from "./game/Game";

import Home from "./ui/Home";

import "./ui/Home.css";

function App() {
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

      <Home />
    </>
  );
}

export default App;