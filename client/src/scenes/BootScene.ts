import Phaser from "phaser";

export class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  create() {
    this.cameras.main.setBackgroundColor("#1e293b");

    this.add
      .text(
        this.cameras.main.centerX,
        this.cameras.main.centerY,
        "NDQ",
        {
          fontSize: "48px",
          color: "#ffffff",
        }
      )
      .setOrigin(0.5);
  }
}