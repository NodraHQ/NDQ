import { useState } from "react";

import Home from "./ui/Home";
import City from "./ui/City/City";
import DungeonSelect from "./ui/Dungeons/DungeonSelect";
import Expedition from "./ui/Dungeons/Expedition";
import BossEncounter from "./ui/Dungeons/BossEncounter";
import RewardSummary from "./ui/Dungeons/RewardSummary";
import Battle from "./ui/Battle/Battle";
import Inventory from "./ui/Inventory/Inventory";
import { usePlayer } from "./state/PlayerContext";
import type { Dungeon, SponsoredBoss } from "./data/dungeons";

import "./ui/Home.css";
import "./ui/City/City.css";

type Screen =
  | { name: "home" }
  | { name: "hub" }
  | { name: "inventory" }
  | { name: "dungeons" }
  | { name: "expedition"; dungeon: Dungeon }
  | { name: "boss-encounter"; dungeon: Dungeon; boss: SponsoredBoss }
  | { name: "battle"; boss: SponsoredBoss }
  | { name: "reward"; title: string; xp?: number; gold?: number; itemName?: string; itemRarity?: string; itemRarityColor?: string; itemStat?: string; note?: string };

function App() {
  const [screen, setScreen] = useState<Screen>({ name: "home" });
  const { addRewards } = usePlayer();

  return (
    <>
      {screen.name === "home" && (
        <Home onEnter={() => setScreen({ name: "hub" })} />
      )}

      {screen.name === "hub" && (
        <City
          onExplore={() => setScreen({ name: "dungeons" })}
          onOpenInventory={() => setScreen({ name: "inventory" })}
        />
      )}

      {screen.name === "inventory" && (
        <Inventory onBack={() => setScreen({ name: "hub" })} />
      )}

      {screen.name === "dungeons" && (
        <DungeonSelect
          onSelect={(dungeon) => setScreen({ name: "expedition", dungeon })}
          onBack={() => setScreen({ name: "hub" })}
        />
      )}

      {screen.name === "expedition" && (
        <Expedition
          dungeon={screen.dungeon}
          onComplete={({ dungeon, bossEncountered }) => {
            addRewards({ xp: dungeon.baseXp, gold: dungeon.baseGold });
            if (bossEncountered) {
              setScreen({ name: "boss-encounter", dungeon, boss: dungeon.boss });
            } else {
              setScreen({
                name: "reward",
                title: "Expedição concluída",
                xp: dungeon.baseXp,
                gold: dungeon.baseGold,
                note: "Nenhum chefe apareceu desta vez.",
              });
            }
          }}
        />
      )}

      {screen.name === "boss-encounter" && (
        <BossEncounter
          boss={screen.boss}
          onBattle={() => setScreen({ name: "battle", boss: screen.boss })}
          onSkip={() =>
            setScreen({
              name: "reward",
              title: "Você seguiu em frente",
              note: `${screen.boss.name} ficou pra próxima expedição.`,
            })
          }
        />
      )}

      {screen.name === "battle" && (
        <Battle
          boss={screen.boss}
          onFinish={(result) => {
            if (result === "victory") {
              setScreen({
                name: "reward",
                title: "Vitória!",
                xp: screen.boss.xp,
                gold: screen.boss.gold,
                itemName: screen.boss.lootName,
                itemRarity: screen.boss.lootRarity,
                itemStat: screen.boss.lootStat,
                note: "Item adicionado ao inventário — NFT simulado nesta build.",
              });
            } else if (result === "defeat") {
              setScreen({ name: "reward", title: "Você foi derrotado", note: "Recupere-se e tente de novo em outra expedição." });
            } else {
              setScreen({ name: "reward", title: "Você fugiu", note: "Sem recompensas desta vez." });
            }
          }}
        />
      )}

      {screen.name === "reward" && (
        <RewardSummary
          title={screen.title}
          xp={screen.xp}
          gold={screen.gold}
          itemName={screen.itemName}
          itemRarity={screen.itemRarity}
          itemRarityColor={screen.itemRarityColor}
          itemStat={screen.itemStat}
          note={screen.note}
          onContinue={() => setScreen({ name: "hub" })}
        />
      )}
    </>
  );
}

export default App;
