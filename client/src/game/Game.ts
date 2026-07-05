import Phaser from "phaser";
import { BootScene } from "../scenes/BootScene";

export function startGame(parent: string) {
  return new Phaser.Game({
    type: Phaser.AUTO,

    parent,

    width: window.innerWidth,
    height: window.innerHeight,

    backgroundColor: "#1e293b",

    scene: [BootScene],

    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
  });
}