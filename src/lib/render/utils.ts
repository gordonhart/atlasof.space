import { CanvasTexture } from 'three';

export function isOffScreen(xPx: number, yPx: number, marginPx = 0) {
  return (
    xPx < -marginPx || xPx > window.innerWidth + marginPx || yPx < -marginPx || yPx > window.innerHeight + marginPx
  );
}

export function getCircleTexture(color: string) {
  const canvas = document.createElement('canvas');
  canvas.width = 16;
  canvas.height = 16;
  const ctx = canvas.getContext('2d')!;
  ctx.beginPath();
  ctx.arc(8, 8, 8, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  return new CanvasTexture(canvas);
}
