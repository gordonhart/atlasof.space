import { CanvasTexture } from 'three';

export function isOffScreen(xPx: number, yPx: number, marginPx = 0) {
  return (
    xPx < -marginPx || xPx > window.innerWidth + marginPx || yPx < -marginPx || yPx > window.innerHeight + marginPx
  );
}

export function getCircleTexture(color: string, size = 64) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  return new CanvasTexture(canvas);
}
