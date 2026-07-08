import { useEffect, useRef } from "react";

type PixelSpriteProps = {
  draw: (ctx: CanvasRenderingContext2D, size: number) => void;
  size?: number;
  displaySize?: number;
  className?: string;
};

// canvas em baixa resolução real, escalado via CSS com pixelated —
// é isso que dá o efeito de pixel art nítido em qualquer tamanho de tela.
export default function PixelSprite({ draw, size = 32, displaySize = 96, className }: PixelSpriteProps) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    draw(ctx, size);
  }, [draw, size]);

  return (
    <canvas
      ref={ref}
      width={size}
      height={size}
      className={className}
      style={{ width: displaySize, height: displaySize, imageRendering: "pixelated" }}
    />
  );
}
