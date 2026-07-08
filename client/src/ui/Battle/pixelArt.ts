// Sprites desenhados via retângulos em um canvas de baixa resolução
// (mesma técnica usada no protótipo HTML). Sem dependência de arquivos
// de arte externos — fácil de trocar por sprites de verdade depois.

function block(ctx: CanvasRenderingContext2D, gx: number, gy: number, gw: number, gh: number, color: string, unit: number) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(gx * unit), Math.round(gy * unit), Math.round(gw * unit), Math.round(gh * unit));
}

export function drawHero(ctx: CanvasRenderingContext2D, size: number) {
  const unit = size / 16;
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, size, size);
  const tunic = "#3f8f4f", tunicDark = "#2a5f36", skin = "#f4c2a1", hair = "#7a4a2b", dark = "#1a1a2e", metal = "#c9c9d6";
  block(ctx, 4, 0, 8, 2, hair, unit);
  block(ctx, 3, 2, 2, 2, hair, unit);
  block(ctx, 11, 2, 2, 2, hair, unit);
  block(ctx, 5, 2, 6, 3, skin, unit);
  block(ctx, 6, 4, 1, 1, dark, unit);
  block(ctx, 9, 4, 1, 1, dark, unit);
  block(ctx, 4, 5, 8, 5, tunic, unit);
  block(ctx, 4, 9, 8, 1, tunicDark, unit);
  block(ctx, 2, 5, 2, 4, tunic, unit);
  block(ctx, 12, 5, 2, 4, tunic, unit);
  block(ctx, 2, 9, 2, 1, skin, unit);
  block(ctx, 12, 9, 2, 1, skin, unit);
  block(ctx, 14, 3, 1, 7, metal, unit);
  block(ctx, 13, 7, 3, 1, "#8a5a2b", unit);
  block(ctx, 4, 10, 3, 4, "#4a4a4a", unit);
  block(ctx, 9, 10, 3, 4, "#4a4a4a", unit);
  block(ctx, 4, 14, 3, 2, dark, unit);
  block(ctx, 9, 14, 3, 2, dark, unit);
}

export function drawStoneGolem(ctx: CanvasRenderingContext2D, size: number) {
  const unit = size / 20;
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, size, size);
  const stone = "#8b8f9b", stoneDark = "#5f636e", glow = "#f4c95d", dark = "#1a1a2e";
  block(ctx, 6, 0, 8, 3, stone, unit);
  block(ctx, 7, 3, 2, 1, glow, unit);
  block(ctx, 11, 3, 2, 1, glow, unit);
  block(ctx, 4, 4, 12, 7, stone, unit);
  block(ctx, 4, 6, 12, 1, stoneDark, unit);
  block(ctx, 8, 7, 4, 3, glow, unit);
  block(ctx, 1, 5, 3, 6, stone, unit);
  block(ctx, 16, 5, 3, 6, stone, unit);
  block(ctx, 0, 10, 4, 3, stoneDark, unit);
  block(ctx, 16, 10, 4, 3, stoneDark, unit);
  block(ctx, 5, 11, 4, 5, stoneDark, unit);
  block(ctx, 11, 11, 4, 5, stoneDark, unit);
  block(ctx, 5, 16, 4, 2, dark, unit);
  block(ctx, 11, 16, 4, 2, dark, unit);
}

export function drawSlimeKing(ctx: CanvasRenderingContext2D, size: number) {
  const unit = size / 20;
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, size, size);
  const green = "#4fbf6b", greenDark = "#33874a", gold = "#f4c95d", dark = "#1a1a2e", white = "#fff";
  block(ctx, 7, 1, 2, 1, gold, unit);
  block(ctx, 9, 0, 2, 2, gold, unit);
  block(ctx, 11, 1, 2, 1, gold, unit);
  block(ctx, 6, 3, 8, 3, green, unit);
  block(ctx, 4, 6, 12, 5, green, unit);
  block(ctx, 2, 9, 16, 6, green, unit);
  block(ctx, 2, 13, 16, 2, greenDark, unit);
  block(ctx, 6, 8, 2, 2, white, unit);
  block(ctx, 12, 8, 2, 2, white, unit);
  block(ctx, 7, 9, 1, 1, dark, unit);
  block(ctx, 13, 9, 1, 1, dark, unit);
}

export function drawMysticOwl(ctx: CanvasRenderingContext2D, size: number) {
  const unit = size / 20;
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, size, size);
  const body = "#5b4a9c", wing = "#43356f", gold = "#f4c95d", dark = "#1a1a2e", cream = "#e8dfc2";
  block(ctx, 2, 6, 4, 7, wing, unit);
  block(ctx, 14, 6, 4, 7, wing, unit);
  block(ctx, 5, 3, 10, 10, body, unit);
  block(ctx, 6, 1, 2, 2, body, unit);
  block(ctx, 12, 1, 2, 2, body, unit);
  block(ctx, 7, 6, 2, 3, cream, unit);
  block(ctx, 11, 6, 2, 3, cream, unit);
  block(ctx, 7, 7, 1, 1, gold, unit);
  block(ctx, 12, 7, 1, 1, gold, unit);
  block(ctx, 9, 8, 2, 1, gold, unit);
  block(ctx, 6, 13, 3, 4, body, unit);
  block(ctx, 11, 13, 3, 4, body, unit);
  block(ctx, 6, 17, 3, 1, dark, unit);
  block(ctx, 11, 17, 3, 1, dark, unit);
}

export function drawChest(ctx: CanvasRenderingContext2D, size: number, rarityColor: string) {
  const unit = size / 16;
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, size, size);
  const wood = "#8a5a2b", woodDark = "#5f3c1c", dark = "#1a1a2e";
  block(ctx, 2, 6, 12, 2, rarityColor, unit);
  block(ctx, 2, 4, 12, 2, woodDark, unit);
  block(ctx, 2, 8, 12, 6, wood, unit);
  block(ctx, 2, 10, 12, 1, woodDark, unit);
  block(ctx, 7, 8, 2, 3, rarityColor, unit);
  block(ctx, 7, 10, 2, 1, dark, unit);
}

export const BOSS_DRAWERS: Record<string, (ctx: CanvasRenderingContext2D, size: number) => void> = {
  "Golem de Pedra Antiga": drawStoneGolem,
  "Slime Rei": drawSlimeKing,
  "Coruja Mística": drawMysticOwl,
};
