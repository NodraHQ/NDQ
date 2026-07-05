import Phaser from "phaser";

export class MenuScene extends Phaser.Scene {
  constructor() {
    super("MenuScene");
  }

  create() {
    this.cameras.main.setBackgroundColor("#4f7942");

    const graphics = this.add.graphics();

    const tileSize = 32;

    // Grama
    graphics.fillStyle(0x6dbb57);

    for (let y = 0; y < 30; y++) {
      for (let x = 0; x < 50; x++) {
        graphics.fillRect(
          x * tileSize,
          y * tileSize,
          tileSize - 1,
          tileSize - 1
        );
      }
    }

    // Lago
    graphics.fillStyle(0x3b82f6);

    graphics.fillRect(
      tileSize * 10,
      tileSize * 6,
      tileSize * 8,
      tileSize * 4
    );

    // Árvore
    graphics.fillStyle(0x14532d);

    graphics.fillRect(
      tileSize * 6,
      tileSize * 5,
      tileSize,
      tileSize
    );

    // Personagem (placeholder)
    this.add.rectangle(
      this.cameras.main.centerX,
      this.cameras.main.centerY,
      24,
      32,
      0xffffff
    );
  }
}